/**
 * Created by prasanna_d on 10/19/2017.
 */
const rn = require('random-number');
const options = {
    min:  1, max:  99999, integer: true
};
const users = [];
const clients = [];
const rooms = [
    {name: 'public Room', roomId: 1, users: [], messages: []}
];

module.exports = [
    function (io) {
        io.on('connection', async function(socket){
            let status = await addUser(socket.handshake.query.user, socket.conn.id);
            if(status[0]){console.log('user connected [' + socket.conn.id + ']');}
            else{console.log('user connected [' + socket.conn.id + '], an error occurred');}

            socket.on('disconnect', async function () {
                let status = await removeUser(socket.conn.id);
                if(status){console.log('user disconnected');}
                else{console.log('user disconnected, an error occurred');}
            });

            //Add to the client list
            let con = true;
            for(let i=0; i<clients.length; i++){
                if(clients[i].id===status[1].id){con = false;}
            }
            if(con){clients.push(status[1]);}

            //send broadcast connect message
            let userName = status[1].first_name + ' ' + status[1].last_name;
            io.sockets.emit('user', JSON.stringify(clients));
            io.sockets.emit('room_update', JSON.stringify(rooms));

            socket.on('message', function(msg){
                io.sockets.emit('message', msg);
            });

            socket.on('add_user_to_room', function(msg){
                console.log(rooms);
                let j_msg = JSON.parse(msg);
                let new_user = j_msg.user;
                let data = j_msg.data;
                console.log(new_user);
                console.log(data);
                let con = false;
                let index = -1;
                for(let i=0; i<rooms.length; i++){
                    if(rooms[i].name===data.name){
                        for(let j=0; j<rooms[i].users.length; j++){
                            if(rooms[i].users[j]._userID===new_user.user.id){
                                con = true;
                            }
                        }
                        index = i;
                        break;
                    }
                }
                console.log('-----------------------');
                for(let item in rooms){
                    console.log(rooms[item].users);
                }
                if(index!==-1 && !con){
                    rooms[index].users.push({
                        _id: (rooms[index].users.length + 1),
                        _userID: new_user.user.id,
                        fullname: new_user.user.first_name + ' ' + new_user.user.last_name,
                        imageUrl: 'https://robohash.org/aa!',
                        username: new_user.user.email,
                        isAdmin: false
                    });
                    io.sockets.emit('add_user_to_room', JSON.stringify(rooms[index]));
                }else{
                    console.log('User already exist');
                }
                for(let item in rooms){
                    console.log(rooms[item].users);
                }
                console.log('-----------------------');
            });

            socket.on('get_room_data', async function (user) {
                console.log(rooms);
                io.sockets.emit('sync_room_data', JSON.stringify(rooms));
                let user_id = JSON.parse(user).id;
                console.log(user_id);
                let ret = [];
                for(let i=0; i<rooms.length; i++){
                    for(let j=0; j<rooms[i].users.length; j++){
                        if(rooms[i].users[j]._userID===user_id){
                            ret.push(rooms[i].users[j]);
                            break;
                        }
                    }
                }
                io.sockets.emit('sync_room_data', JSON.stringify(ret));
            });

            socket.on('room_create', async function(msg){
                let data = JSON.parse(msg);
                let room = data.room;
                let con = true;
                for (let i = 0; i < rooms.length; i++) {
                    if (rooms[i].name === room.name) {
                        con = false;
                    }
                }

                if(con) {
                    let room_num = -1;
                    while (con) {
                        con = false;
                        room_num = rn(options);
                        for (let i = 0; i < rooms.length; i++) {
                            if (rooms[i].roomId === room_num) {
                                con = true;
                            }
                        }
                    }
                    room.roomId = room_num;
                    rooms.push(room);
                    let ret_rooms = {rooms: rooms, ret: data};
                    io.sockets.emit('room_create', JSON.stringify(ret_rooms));
                }else{
                    io.sockets.emit('room_duplicate', data.user);
                }
            });
        });
    }, {
        getUsersList: async function(){
            return users;
        }
    }
];

async function removeUser(socket_id) {
    for(let i=0; i<users.length; i++){
        let user = users[i];
        for(let j=0; j<user.socket.length; j++){
            if(user.socket[j]===socket_id){
                user.socket.splice(j,1);
                return true;
            }
        }
    }
    return false;
}

async function addUser(user, socket_id) {
    let userObj = JSON.parse(user);
    let userStatus = await isUserExist(userObj.id);
    if(userStatus[0]){
        users[userStatus[1]].socket.push(socket_id);
    }else{
        let storeObject = {user: userObj, socket: []};
        storeObject.socket.push(socket_id);
        users.push(storeObject);

        let con = true;
        for(let i=0; i<rooms[0].users.length; i++){
            if(rooms[0].users[i]._userID===userObj.id){
                con = false; break;
            }
        }
        if(con){rooms[0].users.push({
            _id: (rooms[0].users.length + 1),
            _userID: userObj.id,
            fullname: userObj.first_name + ' ' + userObj.last_name,
            imageUrl: 'https://robohash.org/aa!',
            username: userObj.email,
            isAdmin: false
        })}
    }
    return [true,userObj];
}

async function isUserExist(user_id){
    for(let i=0; i<users.length; i++){
        if(users[i].user.id===user_id){return [true, i];}
    }
    return [false, -1];
}
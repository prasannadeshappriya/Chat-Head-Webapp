/**
 * Created by prasanna_d on 10/19/2017.
 */

const users = [];
const clients = [];
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

            socket.on('message', function(msg){
                io.sockets.emit('message', msg);
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
    }
    return [true,userObj];
}

async function isUserExist(user_id){
    for(let i=0; i<users.length; i++){
        if(users[i].user.id===user_id){return [true, i];}
    }
    return [false, -1];
}
/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('HomeController',[
    '$scope', 'AuthService',
    function ($scope, AuthService) {
        let homeCtrl = this;
        let months = ["Jan", "Feb", "March", "April",
            "May", "June", "July", "Aug",
            "Sept", "Oct", "Nov", "Dec"];

        //get current user object
        let user = AuthService.getUser();

        //Create socket connection
        let socket = io.connect('http://localhost:4000', { query: "user=" + JSON.stringify(user.user)});

        socket.on('message', function (msg) {
            try{
                let message = JSON.parse(msg);
                message._id = ((homeCtrl.room[getRoomIndex(message.roomId)].messages.length) + 1);
                if(message.authorId!==user.user.id) {
                    homeCtrl.room[getRoomIndex(message.roomId)].messages.push(message);
                    $scope.$apply();
                }
            }catch (err){
                console.log('An error occurs while parsing the message, [msg: ' + msg + ']')
            }
        });

        socket.emit('get_room_data', JSON.stringify(user.user));
        socket.on('sync_room_data', function (msg) {
            let data = JSON.parse(msg);
            console.log(data)
        });

        socket.on('room_update', function (msg) {
            try{
                homeCtrl.roomAll = JSON.parse(msg);
                $scope.$apply();
            }catch (err){
                console.log('An error occurs while parsing the rooms, [msg: ' + msg + ']')
            }
        });

        socket.on('room_create', function (msg) {
            console.log(msg);
            console.log('test');

            let arrRooms = JSON.parse(msg);
            try{
                homeCtrl.roomAll = [];
                homeCtrl.roomAll = arrRooms.rooms;

                console.log(arrRooms);
                let con = false;
                for(let i=0; i<arrRooms.ret.room.users.length; i++){
                    if(arrRooms.ret.room.users[i]._userID===user.user.id){
                        con = true;
                        break;
                    }
                }
                if (con){homeCtrl.room.push(arrRooms.ret.room);}
                console.log(homeCtrl.room);
                $scope.$apply();
            }catch (err){
                console.log('An error occurs while parsing the rooms, [msg: ' + msg + ']')
            }
        });

        socket.on('user', function (arrUser) {
            try{
                let arrUserObj = JSON.parse(arrUser);
                let userList = {};
                for(let k=0; k<arrUserObj.length; k++){
                    let userObj = arrUserObj[k];
                    userList[userObj.id] = {
                        name: userObj.first_name + ' ' + userObj.last_name,
                        imageUrl: 'https://robohash.org/aa!',
                        username: userObj.email
                    };
                }
                homeCtrl.allusers = userList;
                let index = 1;
                homeCtrl.room[getRoomIndex(1)].users = [];
                Object.keys(homeCtrl.allusers)
                    .forEach(function (key) {
                        homeCtrl.room[getRoomIndex(1)].users.push({
                            _id: index,
                            imageUrl: 'https://robohash.org/aa!',
                            username: homeCtrl.allusers[key].username,
                            fullname: homeCtrl.allusers[key].name
                        });
                        index = index + 1;
                    });
            }catch (err){
                console.log('An error occurs while parsing user object, [user: ' + arrUser + ']')
            }
        });

        homeCtrl.goToRoom = function (roomDetails) {
            console.log(user);
            console.log(homeCtrl.room);
            let con = true;
            for(let i=0; i<homeCtrl.room.length; i++){
                let item = homeCtrl.room[i];
                if(item.name===roomDetails.name){
                    let room_users = homeCtrl.room[i].users;
                    con = true;
                    for(let j=0; j<room_users.length; j++){
                        if(room_users[j]._userID===user.user.id){
                            con = false;}
                    }
                    if(con){
                        homeCtrl.room[i].users.push({
                            _id: (homeCtrl.room[i].users.length + 1),
                            _userID: user.user.id,
                            fullname: user.user.first_name + ' ' + user.user.last_name,
                            imageUrl: 'https://robohash.org/aa!',
                            username: user.user.email,
                            isAdmin: false
                        });
                        break;
                    }
                }
            }
            if (con) {
                let data = {user: user, data: roomDetails};
                socket.emit('add_user_to_room', JSON.stringify(data));
            }else {
                console.log('User already in that room');
            }
        };

        socket.on('add_user_to_room', function (details) {
            let j_details = JSON.parse(details);
            let room_users = j_details.users;
            let con = false;
            for(let i=0; i< room_users.length; i++){
                let room_user = room_users[i];
                if(room_user._userID===user.user.id){
                    con = true;
                    break;
                }
            }
            console.log(con);
            console.log(homeCtrl.room);
            if(con){
                for(let i=0; i< homeCtrl.room.length; i++){
                    if(homeCtrl.room[i].name===j_details.name){
                        homeCtrl.room.splice(i,1);
                        homeCtrl.room.push(j_details);
                        con = false; $scope.$apply(); break;
                    }
                }
            }
            if(con){
                homeCtrl.room.push(j_details);
                con = false; $scope.$apply();
            }
            console.log(homeCtrl.room);
        });

        homeCtrl.invalid_room_name = false;
        homeCtrl.room_duplicate = false;

        homeCtrl.createNewRoom = function () {
            homeCtrl.invalid_room_name = false;
            homeCtrl.room_duplicate = false;
            if (homeCtrl.roomName==='' ||
                typeof homeCtrl.roomName==='undefined'){
                homeCtrl.invalid_room_name = true;
            }else {
                console.log(user);
                let newRoom = { user:user.user.id, room: {
                    name: homeCtrl.roomName,
                    roomId: -1,
                    users: [{
                        _id: 1,
                        _userID: user.user.id,
                        fullname: user.user.first_name + ' ' + user.user.last_name,
                        imageUrl: 'https://robohash.org/aa!',
                        username: user.user.email,
                        isAdmin: true
                    }],
                    messages: []
                }};
                socket.emit('room_create', JSON.stringify(newRoom));
            }
        };

        socket.on('room_duplicate', function (user_id) {
            console.log(details);
            if(user.user.id===user_id){
                homeCtrl.room_duplicate = true;
            }
        });

        //User input message
        homeCtrl.newMessage = '';

        //All users of the room
        //homeCtrl.users = [];

        homeCtrl.roomAll = [];

        //Get all rooms
        homeCtrl.room = [
            {name: 'public Room', roomId: 1, users: [], messages: []},
            {name: 'prasanna', roomId: 126, users: [], messages: []}
        ];

        //Store all messages
        //homeCtrl.messages = [];

        homeCtrl.allusers = [];

        let getRoomIndex = function (id) {
            for(let i=0; i<homeCtrl.room.length; i++){
                if(homeCtrl.room[i].roomId===id){return i}
            }
            return -1;
        };


        homeCtrl.createMessage = function (room_id) {
            if(typeof homeCtrl.newMessage!=='undefined' &&
                homeCtrl.newMessage !==''){
                let userMessage = homeCtrl.newMessage;

                console.log('Should sent message: "' + userMessage + '", [room_id: ' + room_id + ']');
                homeCtrl.newMessage = '';

                let currentDate = new Date();
                let logTime = months[currentDate.getMonth()] + " " +
                    currentDate.getDate() + ", " +
                    currentDate.getHours() + ":" +
                    currentDate.getMinutes();

                let count = homeCtrl.room[getRoomIndex(room_id)].messages.length;
                let messageObj = {
                    _id: (count+1),
                    authorId: user.user.id,
                    roomId: room_id,
                    text: userMessage,
                    time: logTime.toString()
                };

                console.log(messageObj);
                homeCtrl.room[getRoomIndex(room_id)].messages.push(messageObj);

                if(socket){
                    console.log('this is a test');
                    socket.emit('message',JSON.stringify(messageObj));
                }
            }
        };
}]);
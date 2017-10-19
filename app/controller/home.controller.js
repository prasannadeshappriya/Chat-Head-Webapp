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
            try{
                homeCtrl.roomAll = [];
                homeCtrl.roomAll = JSON.parse(msg);
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

        homeCtrl.createNewRoom = function () {
            console.log(user);
            let newRoom = {
                name: 'movies',
                roomId: 245,
                users: [{
                    _id: 1,
                    fullname: user.user.first_name + ' ' + user.user.last_name,
                    imageUrl: 'https://robohash.org/aa!',
                    username: user.user.email
                }],
                messages:[]
            };
            homeCtrl.room.push(newRoom);
            socket.emit('room_create',JSON.stringify(newRoom));
        };

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
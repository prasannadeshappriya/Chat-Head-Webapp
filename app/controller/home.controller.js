/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('HomeController',[
    '$scope', 'AuthService',
    function ($scope, AuthService) {
        let homeCtrl = this;

        //get current user object
        let user = AuthService.getUser();

        //Create socket connection
        let socket = io.connect('http://localhost:4000', { query: "user=" + JSON.stringify(user.user)});

        socket.on('message', function (msg) {
            try{
                let message = JSON.parse(msg);
                message._id = ((homeCtrl.messages.length) + 1);
                if(message.authorId!==user.user.id) {
                    homeCtrl.messages.push(message);
                    $scope.$apply();
                }
            }catch (err){
                console.log('An error occurs while parsing the message, [msg: ' + msg + ']')
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
            }catch (err){
                console.log('An error occurs while parsing user object, [user: ' + msg + ']')
            }
        });


        //User input message
        homeCtrl.newMessage = '';

        //All users of the room
        homeCtrl.users = [];

        //Get all rooms
        homeCtrl.room = {
            name: 'public',
            roomId: 124
        };

        //Store all messages
        homeCtrl.messages = [];

        homeCtrl.allusers = [];

        homeCtrl.createMessage = function () {
            if(typeof homeCtrl.newMessage!=='undefined' &&
                homeCtrl.newMessage !==''){
                let userMessage = homeCtrl.newMessage;

                console.log('Should sent message: "' + userMessage + '"');
                homeCtrl.newMessage = '';

                let count = homeCtrl.messages.length;
                let messageObj = {
                    _id: (count+1),
                    authorId: user.user.id,
                    roomId: 124,
                    text: userMessage,
                    time: 'Aug 3, 20:21'
                };

                console.log(messageObj);
                homeCtrl.messages.push(messageObj);

                if(socket){
                    console.log('this is a test');
                    socket.emit('message',JSON.stringify(messageObj));
                }
            }
        };
}]);
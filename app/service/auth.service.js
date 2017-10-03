/**
 * Created by prasanna_d on 9/26/2017.
 */
app.factory('AuthService',['$localStorage','$http','$location',
    function ($localStorage, $http, $location) {
    let isLogin;

    //Create object to store all the auth functions
    let services = {};
    //add functions to the service object
    services.userLogin = userLogin;
    services.getIsLogin = getIsLogin;
    services.setIsLogin = setIsLogin;
    services.getUser = getUser;
    services.getToken = getToken;
    services.logout = logout;

    //return the service object, so that other controllers
    //can have access to it's methods
    return services;

    function userLogin(token, user,  callback) {
        try {
            $localStorage.currentUser = {
                user: user,
                token: token
            };
            $http.defaults.headers.common.Authorization = 'Bearer ' + token;
            isLogin = true;
            return callback(true);
        }catch  (err){
            console.log(err);
            isLogin = false;
            return callback(false);
        }
    }

    //For Watchers in other controllers
    function getIsLogin() {return isLogin;}

    //setter method for isLogin flag
    function setIsLogin(flag) {isLogin=flag;}

    function getUser() {
        if($localStorage.currentUser){return $localStorage.currentUser;
        }else{return null;}
    }

    function getToken(){
        if($localStorage.currentUser){
            return $localStorage.currentUser.token;}
        $location.path('/');
        return '';
    }
    function logout() {
        isLogin = false;
        delete $localStorage.currentUser;
    }

}]);


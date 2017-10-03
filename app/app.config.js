/**
 * Created by prasanna_d on 9/26/2017.
 */
app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/',{
                templateUrl: "views/particals/user.auth.html",
                controller: 'UserAuthController',
                resolve:{
                    init: function (AuthService, $location) {
                        console.log('Login route initialize');
                        if (AuthService.getUser()!==null) {
                            $location.path('/home');
                        }
                    }
                }
            })
            .when('/login',{
                templateUrl: "views/particals/user.auth.html",
                controller: 'UserAuthController',
                resolve:{
                    init: function (AuthService, $location) {
                        console.log('Login route initialize');
                        if (AuthService.getUser()!==null) {
                            $location.path('/home');
                        }
                    }
                }
            })
            .when('/home',{
                    templateUrl: "views/particals/home.html",
                controller: 'HomeController',
                resolve:{
                    init: function (AuthService, $location) {
                        console.log('Login route initialize');
                        if (AuthService.getUser()===null) {
                            $location.path('/');
                        }
                    }
                }
            })
            .otherwise({redirectTo:'/'});
}]);
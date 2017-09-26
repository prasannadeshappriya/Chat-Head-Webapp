/**
 * Created by prasanna_d on 9/26/2017.
 */
app.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl: "views/particals/login.html",
            controller: 'MainController',
            resolve:{
                init: function () {
                    console.log('this is awsome home');
                }
            }
        })
        .when('/test',{
            templateUrl: "views/particals/register.html",
            resolve:{
                init: function () {
                    console.log('this is awsome');
                }
            }
        });
}]);
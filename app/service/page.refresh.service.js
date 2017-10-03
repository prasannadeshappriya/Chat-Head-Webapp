/**
 * Created by prasanna_d on 9/26/2017.
 */
app.factory('PageRefreshService',[
    '$localStorage', '$http', '$location', 'AuthService',
    function ($localStorage, $http, $location, AuthService) {
        let services = {};
        services.run = run;
        return services;

        function run() {
            console.log('page refreshed');
            if ($localStorage.currentUser) {
                AuthService.setIsLogin(true);
                $http.defaults.headers.common.authorization = 'Bearer ' + $localStorage.currentUser.token;
                $location.path('/home');
            }else{
                AuthService.setIsLogin(false);
                $location.path('/');
            }
        }
}]);
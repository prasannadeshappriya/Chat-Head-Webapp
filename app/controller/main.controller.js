/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('MainController',[
    '$scope', '$http', 'AuthService', '$location',
    function ($scope, $http, AuthService, $location) {
        $scope.isAuthanticated = false;
        $scope.$watch(AuthService.getIsLogin, async function (newValue, oldValue) {
            if(typeof newValue==='undefined'){
                $scope.isAuthanticated = false;
            }else if(newValue){
                $scope.isAuthanticated = newValue;
                let user = await AuthService.getUser();
                if (user) {
                    //Set the user attribute values to the $scope variables
                }
            }else{
                $scope.isAuthanticated = false;
            }
        },true);

        $scope.logOutUser = function () {
            AuthService.logout();
            $http.defaults.headers.common.authorization = '';
            $location.path('/');
        }
}]);
/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('MainController',[
    '$scope', '$http', 'AuthService', '$location', 'UserInfoService',
    function ($scope, $http, AuthService, $location, UserInfoService) {
        //Login user information
        $scope.first_name = '';
        $scope.last_name = '';
        $scope.email = '';
        $scope.image_id = 0;
        $scope.birthday = '';
        $scope.sex = false;

        $scope.isAuthanticated = false;
        $scope.$watch(AuthService.getIsLogin, async function (newValue, oldValue) {
            if(typeof newValue==='undefined'){
                $scope.isAuthanticated = false;
            }else if(newValue){
                $scope.isAuthanticated = newValue;
                let auth = await AuthService.getUser();
                if (auth) {
                    //Set the user attribute values to the $scope variables
                    UserInfoService.setUserDetails(auth);
                    $scope.first_name = auth.user.first_name;
                    $scope.last_name = auth.user.last_name;
                    $scope.email = auth.user.email;
                    $scope.image_id = auth.user.image_id;
                    $scope.birthday = auth.user.birthday;
                    $scope.sex = auth.user.sex;
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
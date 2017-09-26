/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('UserAuthController',['$scope',function ($scope) {
    $scope.onInit = function () {
        console.log('Initialize User Auth View');
    };
    //Error flags-----------------------------------------------------
    $scope.errorReset = function (type) {
        switch (type){
            case 'login_username_error':
                $scope.login_username_error = '';
                break;
            case 'login_password_error':
                $scope.login_password_error = '';
                break;
            case 'reg_username_error':
                $scope.reg_username_error = '';
                break;
            case 'reg_password_error':
                $scope.reg_password_error = '';
                break;
        }
    };
    //----------------------------------------------------------------
    //Password validation--------------------------------------
    $scope.rePasswordValidate = function () {
        if(typeof $scope.reg_re_password==='undefined' ||
            $scope.reg_re_password===''){$scope.reg_re_password_error = ''; return;}
        if($scope.reg_password!==$scope.reg_re_password){
            $scope.reg_re_password_error = 'Confirmed password is not match with your password';
        }else{$scope.reg_re_password_error = '';}
    };
    //----------------------------------------------------------------
    $scope.btnSignIn = async function () {

    };
    $scope.btnSignUp = async function () {

    };
}]);
/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('UserAuthController',[
    '$scope', '$http', 'host_url', 'AuthService', '$location',
    function ($scope, $http, host_url, AuthService, $location) {
    //Male, Female option configure
    $scope.isMale = true;

    //Error flags-----------------------------------------------------
    $scope.isSignInClicked = false;
    $scope.isError = false;
    //Error message variables
    $scope.errorObjectArray = {
        reg_firstname_error: {value: '', view_status: false},
        reg_lastname_error: {value: '', view_status: false},
        reg_email_error: {value: '', view_status: false},
        reg_password_error: {value: '', view_status: false},
        reg_re_password_error: {value: '', view_status: false},
        login_email_error: {value: '', view_status: false},
        login_password_error: {value: '', view_status: false},
        login_error_messages:{value: '', view_status: false}
    };
    //Show hide error messages
    $scope.errorReset = function (type) {
        Object.keys($scope.errorObjectArray)
            .forEach(function (key) {
                if(key===type){
                    $scope.errorObjectArray[key].value='';
                    $scope.errorObjectArray[key].view_status=false;
                }
            });
    };
    function showError(error_code, error) {
        Object.keys($scope.errorObjectArray)
            .forEach(function (key) {
                if(key===error_code){
                    $scope.errorObjectArray[key].value=error;
                    $scope.errorObjectArray[key].view_status=true;
                }
            });
    }
    function hideError(error_code) {
        Object.keys($scope.errorObjectArray)
            .forEach(function (key) {
                if(key===error_code){
                    $scope.errorObjectArray[key].value='';
                    $scope.errorObjectArray[key].view_status=false;
                }
            });
    }
    //Initializing when refresh---------------------------------------
    $scope.onInit = function () {
        console.log('Initialize User Auth View');
    };

    //Password validation---------------------------------------------
    $scope.rePasswordValidate = function () {
        if(typeof $scope.reg_re_password==='undefined' ||
            $scope.reg_re_password===''){
                hideError('reg_re_password_error'); return;}
        if($scope.reg_password!==$scope.reg_re_password){
            showError('reg_re_password_error', 'Confirmed password is not match with your password');
        }else{
            hideError('reg_re_password_error');}
    };

        $scope.userLogOut = function () {
            AuthService.logout();
            console.log('test');
            $http.defaults.headers.common.authorization = '';
        };

    //Button Key press functions--------------------------------------
    $scope.btnSignIn = async function () {
        if(await validateLogin()) {
            try {
                let result = await $http({
                    method: "POST",
                    url: host_url + "users/login",
                    data: {
                        user_email: $scope.login_email,
                        user_password: $scope.login_password
                    }
                });
                console.log(result);
                if (result.status === 200) {
                    AuthService.userLogin(
                        result.data.token, result.data.user, function(status){
                            if(status){
                                console.log('Login success');
                                AuthService.setIsLogin(true);
                                $location.path('/home');
                                $scope.$apply();
                            }
                            else{console.log('Error writing to the local storage')}
                        });
                }else{
                    showError('login_error_messages', 'Something went wrong, Please try again!');
                    $scope.$apply();
                }
            }catch (err){
                if(err.status===401) {
                    showError('login_error_messages', 'Invalid user credentials');
                    $scope.$apply();
                }else if(err.status===400){
                    showError('login_error_messages', 'Email address is invalid or not exist!');
                    $scope.$apply();
                }else{
                    showError('login_error_messages', 'Something went wrong, Please try again!');
                    $scope.$apply();
                }
            }
        }
    };
    $scope.btnSignUp = async function () {
        $scope.isSignInClicked = true;
        if(await validateRegister()){
            console.log('test');
        }
    };

    //Data validations------------------------------------------------
    async function validateRegister() {
        let con = true;
        if (typeof $scope.reg_email === 'undefined' || $scope.reg_email.replace(" ", "") === '') {
            showError('reg_email_error', '* Email is required');
            con = false;
        }
        if (typeof $scope.reg_firstname === 'undefined' || $scope.reg_firstname.replace(" ", "") === '') {
            showError('reg_firstname_error', '* First name is required');
            con = false;
        }
        if (typeof $scope.reg_lastname === 'undefined' || $scope.reg_lastname.replace(" ", "") === '') {
            showError('reg_lastname_error', '* First name is required');
            con = false;
        }
        if (typeof $scope.reg_password === 'undefined' || $scope.reg_password.replace(" ", "") === '') {
            showError('reg_password_error', '* Password is required');
            con = false;
        }
        if (con) {
            //Check for password characters
            if ($scope.reg_password.length < 8) {
                showError('reg_password_error', '* Password should contain at least 8 characters');
                return false;
            }
            //Password confirmation validation
            if($scope.reg_password!==$scope.reg_re_password){
                showError('reg_re_password_error', 'Confirmed password is not match with your password');
                return false;
            }else{
                hideError('reg_re_password_error');
            }
            //Validate for invalid passwords
            return true;
        }
        return false;
    }

    async function validateLogin() {
        let con = true;
        if (typeof $scope.login_email === 'undefined' || $scope.login_email.replace(" ", "") === '') {
            showError('login_email_error', '* Email is required');
            con = false;
        }
        if (typeof $scope.login_password === 'undefined' || $scope.login_password.replace(" ", "") === '') {
            showError('login_password_error', '* Password name is required');
            con = false;
        }
        hideError('login_error_messages');
        return con;
    }
}]);
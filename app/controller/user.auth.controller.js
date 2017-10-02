/**
 * Created by prasanna_d on 9/26/2017.
 */
app.controller('UserAuthController',['$scope',function ($scope) {
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
        reg_re_password_error: {value: '', view_status: false}
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
    //Initializing when refresh---------------------------------------
    $scope.onInit = function () {
        console.log('Initialize User Auth View');
    };

    //Password validation---------------------------------------------
    $scope.rePasswordValidate = function () {
        if(typeof $scope.reg_re_password==='undefined' ||
            $scope.reg_re_password===''){
                console.log('here');
                $scope.errorObjectArray.reg_re_password_error.value = '';
                $scope.errorObjectArray.reg_re_password_error.view_status = false; return;}
        if($scope.reg_password!==$scope.reg_re_password){
            $scope.errorObjectArray.reg_re_password_error.value='Confirmed password is not match with your password';
            $scope.errorObjectArray.reg_re_password_error.view_status = true;
        }else{
            $scope.errorObjectArray.reg_re_password_error.value = '';
            $scope.errorObjectArray.reg_re_password_error.view_status = false;}
    };

    //Validate password
    async function validatePassword() {
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
                $scope.errorObjectArray.reg_re_password_error.value='Confirmed password is not match with your password';
                $scope.errorObjectArray.reg_re_password_error.view_status = true;
                return false;
            }else{
                $scope.errorObjectArray.reg_re_password_error.value='';
                $scope.errorObjectArray.reg_re_password_error.view_status = false;
            }
            //Validate for invalid passwords
            return true;
        }
        return false;
    }

    //Button Key press functions--------------------------------------
    $scope.btnSignIn = async function () {

    };
    $scope.btnSignUp = async function () {
        $scope.isSignInClicked = true;
        if(await validatePassword()){
            console.log('test');
        }
    };
}]);
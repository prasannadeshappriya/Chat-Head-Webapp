/**
 * Created by prasanna_d on 10/11/2017.
 */
app.factory('UserInfoService',[function () {
    //Login user information
    let first_name = '';
    let last_name = '';
    let email = '';
    let image_id = 0;
    let birthday = '';
    let sex = false;

    let services = {};
    services.setUserDetails = setUserDetails;
    services.getUserDetails = getUserDetails;
    return services;

    function setUserDetails(login_user) {
        first_name = login_user.user.first_name;
        last_name = login_user.user.last_name;
        email = login_user.user.email;
        image_id = login_user.user.image_id;
        birthday = login_user.user.birthday;
        sex = login_user.user.sex;
    }

    function getUserDetails(){
        return {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'image_id': image_id,
            'birthday': birthday,
            'sex': sex
        }
    }
}]);
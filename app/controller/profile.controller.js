/**
 * Created by prasanna_d on 10/11/2017.
 */
app.controller('ProfileController',[
    '$scope', '$http',
    function ($scope, $http) {
        $scope.onInit = async function () {
            console.log('Profile Page Initialized')
        }
    }
]);
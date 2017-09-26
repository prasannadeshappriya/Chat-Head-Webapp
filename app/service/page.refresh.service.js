/**
 * Created by prasanna_d on 9/26/2017.
 */
app.factory('PageRefreshService',[function () {
    let services = {};
    services.run = run;
    return services;

    function run() {
        console.log('Page Refreshed');
    }
}]);
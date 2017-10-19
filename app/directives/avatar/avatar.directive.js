(function() {
  'use strict';

  angular
    .module('Chat-Head-App')
    .directive('avatar', avatar);

  /** @ngInject */
  function avatar() {
    var directive = {
      restrict: 'E',
      scope: {
        user: '='
      },
      replace: true,
      template: '<div ng-include="contentUrl"></div>',
      link: function (scope, element, attributes) {
          scope.contentUrl = "";
          var key = "###";
          var baseUrl = ["directives/avatar/", key, ".avatar.directive.tmpl.html"].join("");
          if(scope.user.imageUrl){
              scope.contentUrl = baseUrl.replace(key, "filled");
          }else{
              scope.contentUrl = baseUrl.replace(key, "anonymous");
          }
        }
    };
    return directive;
  }
})();

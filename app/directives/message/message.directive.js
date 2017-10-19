(function() {
  'use strict';

  angular
    .module('Chat-Head-App')
    .directive('message', message);

  /** @ngInject */
  function message() {
    let directive = {
      restrict: 'E',
      templateUrl: 'directives/message/message.item.tmpl.html',
      controller: ['$mdDialog', function ($mdDialog) {
          var messageCtrl = this;
      }],
      controllerAs: 'messageCtrl',
      bindToController: true,
      scope:{
        message: "=",
        author: "="
      }
    };

    return directive;

    /** @ngInject */
    // function MessageController($mdDialog){
    //
    //
    // }
  }

})();

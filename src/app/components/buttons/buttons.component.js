(function () {
  "use strict";
  angular.module("MyApp").directive('buttonSubmit', function ($compile, $q) {
    return {
      restrict: 'AE',

      transclude: true,
      template: '<ng-transclude></ng-transclude>',
      //replace:true,
      link: function ($scope, $element, $attrs) {

      }
    }
  })
})();

/**
 * Quản lý ẩn hiện giao diện theo quyền
 */

(function () {
  'use strict';
  angular
    .module('MyApp')
    .directive('siPermission', function () {
      return {
        restrict: "A",
        scope: {
          siPermission: "@"
        },
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: function (scope, element, attrs, ctrl) {
          scope.element = element;
          $(element).hide();

          scope.siPermission = scope.siPermission.split(',');
        },
        controller: function ($scope, $rootScope) {
          $rootScope.$watch("userPermissions", function (permissions) {
            if (permissions) {
              let visible = true;
              let count = 0;

              let allow_permisisons = $scope.siPermission.split(",");

              allow_permisisons.forEach(name => {
                if (!permissions[name]) {
                  count++;
                }
              });

              if (count == allow_permisisons.length) visible = false;

              if (visible) {
                $($scope.element).show();
              } else {
                $($scope.element).hide();
              }
            }
          })
        },
      }
    });
})();

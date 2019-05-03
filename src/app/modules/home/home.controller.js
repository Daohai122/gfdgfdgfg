(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Home.Controller", function ($rootScope, $state, $scope, $compile, ApiService, $location, AuthService) {

      $scope.init = () => {
        $('[data-toggle="m-tooltip"]').tooltip({
          placement: "auto"
        });
      }

      $scope.init()

      $scope.getMedia = () => {
        ApiService.GET("media?limit=4").then(res => {
          $scope.dataMedia = res.data;
          $scope.dataMedia.map(function(item, index) {
            item.image = GLOBAL_CONFIG.UPLOAD + item.fileUpload;
          })
          $scope.$apply();
        })
      }

      $rootScope.$watch("userInfo", function(change) {
        if (change != undefined) {
          if ($rootScope.userInfo.profileImageUrl.indexOf(GLOBAL_CONFIG.UPLOAD) < 0) {
            $rootScope.userInfo.image = GLOBAL_CONFIG.UPLOAD + $rootScope.userInfo.profileImageUrl;
          } else {
            $rootScope.userInfo.image = $rootScope.userInfo.profileImageUrl;
          }
        }
      }, true)

      $scope.getMedia();

      $scope.logout = function () {
        AuthService.logout();
      }

    });
})();

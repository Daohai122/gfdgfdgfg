(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("Term.Controller", function ($rootScope, $state, $scope, ApiService) {
        $scope.$on("$viewContentLoaded", function () {
          $scope.getTermsVi();
          $scope.getTermsEv();
        });
        $scope.data={};
        $scope.getTermsVi = () =>  {
          ApiService.GET("settings/term_vi").then(res => {
            $scope.data.term_vi = res;
            $scope.$apply();
          })
        };
        $scope.getTermsEv = () =>  {
          ApiService.GET("settings/term_en").then(res => {
            $scope.data.term_en = res;
            $scope.$apply();
          })
        };
        $scope.update = () => {
          let datavi= {
            name:"term_vi",
            value:$scope.data.term_vi,
          }
          ApiService.PUT("settings",datavi).then(res => {
            // toastr.success("chỉnh sửa điều khoản thành công");
          });
          let dataen= {
            name:"term_en",
            value:$scope.data.term_en,
          }
          ApiService.PUT("settings",dataen).then(res => {
            toastr.success("Thành công");
          });
        }
      });
  })();
  
(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.DauRa.CaiThienThuNhap", function(
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      OptionService
    ) {
      $scope.init = () => {
        $scope.getReportData();
        $scope.getCenter();
      };
      $scope.dataReport;
      $scope.columns = [];

      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        
        let data = {};
        ApiService.POST("/reports/KetQua_CaiThienThuNhap", query).then(res => {
          $scope.dataReport = res;
          $scope.$apply();
          $scope.updateRequestParams(query);
        });
      };
    });
})();

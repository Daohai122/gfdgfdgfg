(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.Output.HocVienTotNghiep", function (
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      OptionService
    ) {
      $scope.init= () =>{
        $scope.getReportData();
        $scope.getCenter();
      }
      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        ApiService.POST("reports/DauRa_HVTotNghiep", query).then(res => {
          $scope.hvTotNghiepReport = res;
          if ($scope.hvTotNghiepReport && $scope.hvTotNghiepReport.length > 0) {
            for (let i = 0; i < $scope.hvTotNghiepReport.length; i++) {
              $scope.hvTotNghiepReport[i].male_percent = (($scope.hvTotNghiepReport[i].male_count / $scope.hvTotNghiepReport[i].total_count) * 100).toFixed(2);
              $scope.hvTotNghiepReport[i].feMale_percent = (100 - $scope.hvTotNghiepReport[i].male_percent).toFixed(2);
            }
          }
          $scope.$apply();
          $scope.updateRequestParams(query);
        });
      }
      $scope.hvTotNghiepReport;

      $scope.batch;
      $scope.center;
      $scope.class;
      $scope.xuatexel = (table, name) => {
        ApiService.tableToExcel(table, name);
      };

    });
})();

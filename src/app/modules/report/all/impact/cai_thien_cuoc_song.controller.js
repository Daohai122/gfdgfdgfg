(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.CaiThienCuocSong", function (
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      OptionService
    ) {
      $scope.init = function () {
        $scope.getReportData();
        $scope.getCenter();
      }

      $scope.dataReport;
      $scope.columns = [];

      $scope.getReportData = () => {
        $scope.columns = [
          {key: "center_name",title: "Trung tâm"}, 
          {key: "batch_name",title: "Khóa"},
          {key: "batch_name",title: "Khóa"},];
        let query = $scope.getSearchParams($scope.dataFilter);

        let data = [];
        ApiService.POST("reports/TacDong_CaiThienCuocSong", query).then(res => {
          let field_key = {};
          res.map(item => {
            for (let key in item.gender) {
              field_key[key] = true;
              item["total." + key] = item.gender[key].total;
              item["percent." + key] = item.gender[key].percent;
            }
            data.push(item);
          });


          for (let i in field_key) {
            let data = {};
            data.key = "total." + i;
            data.title = bietQua[i];
            data.percent = "percent." + i;
            $scope.columns.push(data);
          }
          $scope.dataReport = data;
          $scope.$apply();
          $scope.drawChartMale();

          $scope.updateRequestParams(query);
        });
      }
    });

})();

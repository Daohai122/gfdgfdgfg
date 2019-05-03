(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.NhomTuoi", function (
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      $element,
      ApiService,
      OptionService
    ) {
      $scope.$on('$viewContentLoaded', function () {

      });

      $scope.init = function () {
        $scope.getReportData();
        $scope.getCenter();
      }

      $scope.genderReport;
      let chart;
      $scope.columns = [];
      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        ApiService.POST("reports/TacDong_NhomTuoi", query).then(res => {
          $scope.oldReport = res;
          let field_key = {};
          res.map(item => {
            for (let key in item.age_group) {
              field_key[key] = true;
            }
          });

          $scope.columns = field_key;
          $scope.$apply();
          $scope.drawPiceMale();

          $scope.updateRequestParams(query);
        });
      }
      $scope.dataChart = {};

      $scope.dataFormat = {
        from16To18: '16-18 (tuổi)',
        from25To30: "25-30 (tuổi)",
        from19To24: "19-24 (tuổi)",
        over30: ">30 (tuổi)"
      }

      $scope.drawPiceMale = () => {
        let dataDrawPice = [];
        if ($scope.oldReport && $scope.oldReport.length > 0) {
          // lọc lấy list các tuổi có trong dữ liệu
          $scope.oldReport.map(item => {
            for (let key in item.age_group) {
              $scope.dataChart[key] = 0;
            }
          });
          // tính tổng các độ tuổi
          $scope.oldReport.map(i => {
            for (let key in i.age_group) {
              $scope.dataChart[key] = $scope.dataChart[key] + i.age_group[key].count;
            }
          });
          // tạo data để vẽ
          for (let key in $scope.dataChart) {
            let data = {};
            data.value = $scope.dataChart[key];
            data.category = key;
            dataDrawPice.push(data);
          }
          // chuyển đổi mã tuổi thành text from16To18 = '16-18 (tuổi)' dựa vào obj $scope.dataFormat
          let dataDrawPiceVitural = [];
          dataDrawPice.map(item => {
            let data = {};
            data.value = item.value;
            data.category = $scope.dataFormat[item.category];
            dataDrawPiceVitural.push(data);
          });
          dataDrawPice = dataDrawPiceVitural;
          // vẽ
          var chartContainer = $($element).find("#chartPice")[0];
          chart = am4core.create(chartContainer, am4charts.PieChart3D);
          chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

          chart.legend = new am4charts.Legend();

          chart.data = dataDrawPice;
          var series = chart.series.push(new am4charts.PieSeries3D());
          series.dataFields.value = "value";
          series.dataFields.category = "category";

        } else {
          if (chart) {
            chart = null;
          }
        }
      }

    });

})();

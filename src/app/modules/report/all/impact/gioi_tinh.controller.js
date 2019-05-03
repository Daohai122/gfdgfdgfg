(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.GioiTinh", function (
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      $element,
      ApiService,
      OptionService
    ) {

      $scope.init = function () {
        $scope.getReportData();
        $scope.getCenter();
      }

      $scope.genderReport;
      let chart;

      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        ApiService.POST("reports/TacDong_GioiTinh", query).then(res => {
          $scope.genderReport = res;

          $scope.genderReport = $scope.genderReport.map(item => {
            let dataVirtual = {};
            dataVirtual.centerName = item.center_name;
            dataVirtual.male = item.gender.True.gender_count;
            dataVirtual.feMale = item.gender.False.gender_count;
            dataVirtual.malePercent = item.gender.True.percent;
            dataVirtual.feMalePercent = item.gender.False.percent;
            return dataVirtual
          })
          $scope.$apply();
          $scope.drawPiceMale();
          $scope.updateRequestParams(query);
        });
      }

      $scope.drawPiceMale = () => {
        if ($scope.genderReport && $scope.genderReport.length > 0) {
          let sumMale = 0;
          let sumFeMale = 0;

          $scope.genderReport.forEach(item => {
            sumMale = sumMale + item.male;
            sumFeMale = sumFeMale + item.feMale;
          });

          var chartContainer = $($element).find("#chartPice")[0];
          chart = am4core.create(chartContainer, am4charts.PieChart3D);
          chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

          chart.legend = new am4charts.Legend();
          chart.data = [{
              category: "Nam",
              value: sumMale,
              color: "red",
            },
            {
              category: "Nữ",
              value: sumFeMale,
              color: "blue"
            },
          ];
          var series = chart.series.push(new am4charts.PieSeries3D());
          series.dataFields.value = "value";
          series.dataFields.category = "country";
        } else {
          if (chart) {
            chart = null;
          }
        }
      }

    });

})();

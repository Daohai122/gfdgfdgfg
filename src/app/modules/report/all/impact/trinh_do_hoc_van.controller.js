(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.TrinhDoHocVan", function(
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      $element,
      ApiService,
      OptionService
    ) {
      $scope.init = function() {
        $scope.getReportData();
        $scope.getCenter();
      };
      $scope.columns = [];
      let nameEducation = {
        cap_0: "Cấp 1",
        cap_1: "Cấp 2",
        cap_2: "Cấp 3",
        cap_3: "Trung cấp",
        cap_4: "Cao Đẳng, Đại học",
        cap_5: "Khác"
      };
      $scope.dataReport;
      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        $scope.columns = [{ title: "Trung tâm", key: "center_name" }];
        ApiService.POST("reports/TacDong_TrinhDoHocVan", query).then(res => {
          let fileld_col = {};
          let data = [];
          res.map(item => {
            for (let key in item.education_level) {
              fileld_col[key] = true;
              item["cap_" + key] = item.education_level[key].student_count;
              item["percent" + key] = item.education_level[key].percent;
            }
            data.push(item);
          });
          for (let key in fileld_col) {
            let columnsFileld = {};
            columnsFileld.title = nameEducation["cap_" + key];
            columnsFileld.key = "cap_" + key;
            columnsFileld.percent = "percent" + key;
            $scope.columns.push(columnsFileld);
          }

          $scope.dataReport = data;
          $scope.$apply();
          $scope.drawPiceMale(fileld_col);
          $scope.updateRequestParams(query);
        });
      };
      $scope.exportExcel = () => {
        let colums = [
          { key: "student_code", title: "Mã sinh viên" },
          { key: "full_name", title: "Họ tên" },
          { key: "education_level",
           title: "Trình độ học vấn",
            render:(data) => {
              let eduLevel = {
                0: "Cấp 1",
                1: "Cấp 2",
                2: "Cấp 3",
                3: "Trung cấp",
                4: "Cao Đẳng, Đại học",
                5: "Khác"
              };
              return eduLevel[data];
            }
          }
        ];
        $scope.exportDataToExcel(colums, 'Trình độ học vấn');
      };
      let chart;
      $scope.drawPiceMale = data => {
        if ($scope.dataReport && $scope.dataReport.length > 0) {
          let dataPice = [];
          if (data) {
            for (let key in data) {
              let col = {};
              col.title = "cap_" + key;
              col.value = 0;
              dataPice.push(col);
            }
          }
          $scope.dataReport.forEach(item => {
            dataPice = dataPice.map(value => {
              value.value += item[value.title] ? item[value.title] : 0;
              return value;
            });
          });
          dataPice = dataPice.map(item => {
            item.title = nameEducation[item.title];
            return item;
          });
          var chartContainer = $($element).find("#chartPice")[0];
          chart = am4core.create(chartContainer, am4charts.PieChart3D);
          chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

          chart.legend = new am4charts.Legend();
          chart.data = dataPice;
          // debugger;
          var series = chart.series.push(new am4charts.PieSeries3D());
          series.dataFields.value = "value";
          series.dataFields.category = "title";
        } else {
          if (chart) {
            chart = null;
          }
        }
      };
    });
})();

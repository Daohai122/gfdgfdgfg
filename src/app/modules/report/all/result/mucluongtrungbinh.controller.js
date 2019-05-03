(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.Ketqua.MucLuongTrungBinh", function(
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
      $scope.dataReportGender;
      $scope.columns = [];

      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        let data = {};
        ApiService.POST("/reports/KetQua_MucLuongTrungBinh", query).then(
          res => {
            $scope.formatDataReport(res);
            $scope.dataReport = res;
            $scope.$apply();
            $scope.updateRequestParams(query);
          }
        );
      };
      $scope.mainColumns = [];
      $scope.formatDataReport = data => {
        $scope.columns = [
          {
            title: "Trung tâm",
            rowspan: "2",
            colspan: "1",
            value: "center_name"
          },
          { title: "Khóa", rowspan: "2", colspan: "1", value: "batch_name" }
        ];
        $scope.mainColumns = [
          {
            title: "Trung tâm",
            rowspan: "2",
            colspan: "1",
            value: "center_name"
          },
          { title: "Khóa", rowspan: "2", colspan: "1", value: "batch_name" }
        ];

        $scope.subHeader = [];

        $scope.dataReportGender = [];
        let field_name = {};
        data.map(item => {
          for (let key in item.avg_salary) {
            field_name[key] = true;
            item.avg_salary[key].avg_salary_male = 0;
            item.avg_salary[key].avg_salary_female = 0;
            for (let value in item.avg_salary[key].avg_class_salary) {
              item.avg_salary[key].avg_salary_male +=
                item.avg_salary[key].avg_class_salary[value].avg_salary_male;
              item.avg_salary[key].avg_salary_female +=
                item.avg_salary[key].avg_class_salary[value].avg_salary_female;
            }
          }
          $scope.dataReportGender.push(item);
        });
        let dataNew = [];
        $scope.dataReportGender.map(item => {
          for (let key in item.avg_salary) {
            item["lan_" + key + "_nam"] = item.avg_salary[key].avg_salary_male;
            item["lan_" + key + "_nu"] = item.avg_salary[key].avg_salary_female;
            item["lan_" + key + "_tong"] =
              item.avg_salary[key].avg_batch_salary;
          }
          dataNew.push(item);
        });
        $scope.dataReportGender = dataNew;
        for (let key in field_name) {
          let data = {};
          data.value = key;
          data.rowspan = "1";
          data.colspan = "3";
          data.title = "lần " + key;

          $scope.columns.push(data);
          $scope.mainColumns.push({
            title: "Nam",
            value: "lan_" + key + "_nam"
          });
          $scope.mainColumns.push({
            title: "Nữ",
            value: "lan_" + key + "_nu"
          });
          $scope.mainColumns.push({
            title: "Tổng",
            value: "lan_" + key + "_tong"
          });
        }

        $scope.generateSubHeader($scope.columns.length - 2);
      };
      $scope.generateSubHeader = function(countColumn) {
        for (let i = 0; i < countColumn; i++) {
          $scope.subHeader.push({ title: "Nam" });
          $scope.subHeader.push({ title: "Nữ" });
          $scope.subHeader.push({ title: "Tổng" });
        }
      };
    });
})();

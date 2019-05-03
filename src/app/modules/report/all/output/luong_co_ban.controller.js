(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.Output.LuongCoBan", function (
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
      $scope.dataReport;
      $scope.columns = [{
          key: "standard_salary",
          title: "Salary standard"
        },
        {
          key: "batch_name",
          title: "Khóa"
        },
      ];
      $scope.columnsRender;

      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        let data = {};
        ApiService.POST("/reports/DauRa_LuongCoBan", query).then(res => {
          let field_key = {};
          res.map(item => {
            for (let key in item.count_by_so_lan) {
              field_key[key] = true;
              item["lan_thu." + key] = item.count_by_so_lan[key].count_meet_standard_salary;
            }
            if (data[item.center_name]) {
              if (item.standard_salary) {
                item.standard_salary = (item.standard_salary).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
              }
              data[item.center_name].items.push(item);
            } else {
              if (item.standard_salary) {
                item.standard_salary = (item.standard_salary).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
              }

              data[item.center_name] = {
                center_name: item.center_name,
                items: [item]
              }
            }
            // return item;
          });
          $scope.dataReport = data;
          let dataColumns = $scope.columns.slice(0);
          for (let field_code in field_key) {
            let data = {};
            data.key = "lan_thu." + field_code;
            data.title = "Lần " + field_code;
            dataColumns.push(data);
          }
          $scope.columnsRender = dataColumns;
          $scope.$apply();
          $scope.updateRequestParams(query);

        });
      }

    });
})();

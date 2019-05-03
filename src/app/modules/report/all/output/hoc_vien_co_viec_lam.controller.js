(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.Ouput.HocVienCoViecLam", function (
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
          key: "batch_name",
          title: "Khóa"
        },
        {
          key: "total_count",
          title: "Tổng số"
        }
      ];
      $scope.columnsRender;

      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);
        let data = {};
        ApiService.POST("/reports/DauRa_HVCoViecLam", query).then(res => {
          let field_key = {};
          res.map(item => {
            for (let key in item.lan_thu) {
              field_key[key] = true;
              item["lan_thu." + key] = item.lan_thu[key];
            }
            if (data[item.center_name]) {
              data[item.center_name].items.push(item);
            } else {
              data[item.center_name] = {
                center_name: item.center_name,
                items: [item]
              }
            }
            // return item;
          });
          let dataColumns = $scope.columns.slice(0);
          for (let field_code in field_key) {
            let data = {};
            data.key = "lan_thu." + field_code;
            data.title = "Lần " + field_code;
            dataColumns.push(data);
          }
          $scope.columnsRender = dataColumns;
          $scope.dataReport = data;
          $scope.$apply();
          $scope.updateRequestParams(query);

        });
      };

    });
})();

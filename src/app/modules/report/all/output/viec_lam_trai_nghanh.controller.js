(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report_DauRa_ViecLamTraiNgHanh", function(
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
            key: "class_name",
            title: "Lớp"
          },
          {title:"Số HV có viêc làm", key:"total_count"}
        ];
  
        $scope.getReportData = () => {
          let query = $scope.getSearchParams($scope.dataFilter);
          let data = {};
          ApiService.POST("/reports/DauRa_ViecLamTraiNghanh", query).then(res => {
            let field_key = {};
            res.map(item => {
              for (let key in item.count_by_so_lan) {
                field_key[key] = true;
                item["lan_thu." + key] = item.count_by_so_lan[key];
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
            for (let field_code in field_key) {
              let data = {};
              data.key = "lan_thu." + field_code;
              data.title = "Lần " + field_code;
              $scope.columns.push(data);
            }
            $scope.dataReport = data;
            $scope.$apply();
            $scope.updateRequestParams(query);
          });
        };
      });
      
  })();
  
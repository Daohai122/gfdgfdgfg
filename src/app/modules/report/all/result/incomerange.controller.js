(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.KetQua.Incomerange", function(
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
        $scope.columns = [
          {title:"Khóa", key:"batch_name",max:"batch_name"},
        ];
        $scope.columnsRender;
        $scope.getReportData = () => {
          let query = $scope.getSearchParams($scope.dataFilter);
          
          let data = {};
          ApiService.POST("/reports/KetQua_IncomeRange", query).then(res => {
            let field_key={};
            res.map(item => {
              for(let key  in item.income_range){
                field_key[key] = true;
                item["minimum_salary." +key] = item.income_range[key].minimum_salary;
                item["maximum_salary." +key] = item.income_range[key].maximum_salary;
              }
              if(data[item.center_name]){
                data[item.center_name].items.push(item);
              } else {
                data[item.center_name] = {
                  center_name: item.center_name,
                  items: [item]
                }
              }
            });
            let dataColumns = $scope.columns.slice(0);
            for(let key in field_key){
              let data={};
              data.title = "Lần " +key;
              data.key= "minimum_salary." + key;
              data.max="maximum_salary."+ key;
              dataColumns.push(data);
            }
            $scope.columnsRender = dataColumns;
            $scope.dataReport=data;
            $scope.$apply();
            $scope.updateRequestParams(query);
          });
        };
      });
      
  })();
  
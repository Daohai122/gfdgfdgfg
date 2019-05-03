(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.Lop", function(
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      OptionService
    ) {
      $scope.init = function() {
        $scope.getReportData();
        $scope.getCenter();
      };
      $scope.columns = [{title:"Chuyên ngành", key:"field_code"},
      {title:"Khóa", key:"batch_name"},
      {title:"Tổng số lớp", key:"class_count"},
      {title:"Tổng số học viên", key:"student_count"}];
      
      

      $scope.dataReport;

      $scope.getReportData = () => {
       
        let query = $scope.getSearchParams($scope.dataFilter);
        ApiService.POST("reports/TacDong_Lop", query).then(res => {
          let fileld_col = {};
          let data = {};
          res.map(item => {
            if(data[item.center_name]){
              data[item.center_name].items.push(item);
            } else {
              data[item.center_name] = {
                center_name: item.center_name,
                items: [item],
                khoas: []
              }
            }
          });
          for(let value in data) {
            data[value].items.forEach(element => {
              if(data[value].khoas[element.field_code]){
                data[value].khoas[element.field_code].elements.push(element);
              } else {
                data[value].khoas[element.field_code] = {
                  field_code: element.field_code,
                  elements:[element]
                }
              }
            });
          }
          $scope.dataReport = data;
          $scope.$apply();
          // $scope.drawPiceMale();
          $scope.updateRequestParams(query);
        });
      };
    });
})();

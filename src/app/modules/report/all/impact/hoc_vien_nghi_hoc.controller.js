(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.HocVienNghiHoc", function (
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
      $scope.columns=[];

      $scope.columnsRender;
      $scope.dataReport;

      $scope.getReportData = () => {
        $scope.columns=[
          {title:"Trung tâm",key:"center_name"},
          { title:"Học viên nhập học", key:"hoc_vien_nhap_hoc"}];
        let columnsTong= [ {title:"Số HV đào tạo",key:"hoc_vien_dao_tao"},{title:"Tỉ lệ bỏ học",show:true,key:"hoc_vien_bo_hoc"}]
        let query = $scope.getSearchParams($scope.dataFilter);
        ApiService.POST("reports/TacDong_HocVienNghiHoc", query).then(res => {
          let fileld_col={};
          let dataFormat=[];
          res.map(item => {
            for(let key in item.month_status){
              fileld_col[key] = key;
              item["thang."+key] =item.month_status[key];
            }
            dataFormat.push(item);
          });
          for(let key in fileld_col) {
            let data={};
            data.title = "Tháng " + key,
            data.key = "thang." + key
            $scope.columns.push(data);
          }
          $scope.columns=$scope.columns.concat(columnsTong);
          $scope.dataReport = dataFormat;
          $scope.$apply();
          // $scope.drawPiceMale();
          $scope.updateRequestParams(query);
        });
      }
    });
})();

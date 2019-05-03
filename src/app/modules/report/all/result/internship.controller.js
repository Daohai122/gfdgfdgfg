(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Internship.Controller", function(
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
          {title:"Trung tâm", key:"center_name"},
          {title:"Khóa",key:"batch_name"},
          {title:"Lớp",key:"class_name"},
          {title:"Số lượng HV thực tập", key:"thuc_tap"},
          {title:'Số lượng HV hoàn thành thực tập',key:"hoan_thanh"},
          {title:"Số lượng HV không hoàn thành thực tập", key:"khong_hoan_thanh"},
          {title:"Số lượng HV được DN tiếp nhận sau thực tập", key:"duoc_tiep_nhan"},
          {title:"Số lượng HV bỏ thực tập",key:"bo_thuc_tap"},
          {title:"Số lượng HV được hỗ trợ học phí", key: 'ho_tro_hoc_phi'}
        ];
        
        $scope.getReportData = () => {
          let query = $scope.getSearchParams($scope.dataFilter);
          
          ApiService.POST("reports/KetQua_Intership", query).then(res => {
            $scope.dataReport=res;
            $scope.$apply();
            $scope.updateRequestParams(query);
          });
        };
      });
  })();
  
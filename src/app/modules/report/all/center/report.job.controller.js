(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.Center.Job.Controller", function(
        $rootScope,
        $stateParams,
        $state,
        $scope,
        $compile,
        ApiService,
        OptionService
      ) {
        $scope.init= () =>{
          // $scope.getReportData();
          $scope.getCenter();
        }
        $scope.dataReport;
        $scope.columns=[];
        $scope.getReportData = () => {
          $scope.columns=[{title:"STT", key:"stt"},{title:"Họ Tên", key:"student_name"},{title:"Giới tính",key:"student_gender"},
          {title:"Ngày sinh", key:"student_birthday"},
          {title:"Số điện thoại", key:"student_phones"},
          {title:"Trung tâm",key:"center_name"},
          {title:"Khóa", key:"batch_name"},
          {title:"Lớp",key:"class_name"},
          {title:"Công ty", key:"company_name"},
          {title:"Địa chỉ Công ty", key:"company_address"},
          {title:"Số điện thoại của công ty", key:"company_phone"},
          {title:"Vị trí nhân viên", key:"job_position"},
          {title:"Loại hợp đồng", key:"job_contract_type"},
          {title:"Lương cơ bản", key:"salary_net"},
          {title:"Tổng thu nhập", key:"salary_gross"}
        ];
          
          let query = $scope.getSearchParams($scope.dataFilter);
          let typeJob = {0:"Chưa biết", 1:"3 tháng", 2:"6 tháng",3:"1 năm", 4: "Khác", 5:"Thử việc", 6:"Thời vụ", 7: "Vô thời hạn", 8:'Không hợp đồng', 9: "Tự kinh doanh"};

          ApiService.POST("reports/TrungTam_TheoDoiViecLam", query).then(res => {
            res = res.map((item, index) => {
              item.stt = index +1;
              if(item.student_gender == true){
                item.student_gender ="Nam";
              } else if(item.student_gender == false){
                item.student_gender ="Nữ";
              }
              if(item.job_contract_type) {
                item.job_contract_type = typeJob[item.job_contract_type]
              }
              if(item.student_birthday){
                item.student_birthday = ApiService.formatDate(item.student_birthday);
              }
              return item;
            })
            $scope.dataReport = res;
            $scope.$apply();
            $scope.updateRequestParams(query);
          });
        };
      });
      
  })();
  
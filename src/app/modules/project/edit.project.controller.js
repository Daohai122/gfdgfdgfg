
(function() {
  "use strict";
  angular
  .module("MyApp")
  .controller("Edit.Project.Controller", function(
    $rootScope,
    $state,
    $scope,
    ApiService,
    $compile,
    $stateParams,
    OptionService
    ) {
    $scope.dataCenter;
    $scope.dataPartners;
    $scope.dataProject;
    $scope.dataMilestoneReports;
    $scope.dataReportSelect;
    $scope.mode="add";
    // $("#select_parner").select2({
    //   placeholder:"Select..."
    // }).on("select2:close", (data) => {
    //   $scope.dataProject.partners= $("#select_parner").val();
    //   $scope.$apply();
    // });
    // $("#select_center").select2({
    //   placeholder:"Select..."
    // }).on("select2:close", (data) => {
    //   $scope.dataProject.center_code= $("#select_center").val();
    //   $scope.$apply();
    // });
    $("#datetime3, #datetime2,#datetime1").datepicker({
      todayHighlight: !0,
      orientation: "bottom left",
      format: "yyyy/m/d"
    });
    $scope.goToList =() => {
    $state.go('admin.project.list');
  }
    $scope.getPartner = () => {
      return new Promise((resolve,rejects)=> {
        ApiService.GET("partners").then(res => {
          $scope.dataPartners=res.data;
          $scope.$apply();
          resolve(true);
        })
      });
    };
    
    $scope.getCenter = () => {
      return new Promise((resolve,rejects)=> {
        OptionService.getCenter().then(res => {
          $scope.dataCenter = res;
          $scope.$apply();
          resolve(true)
        });
      });
    };
    $scope.addProject = () => {
    let fromDate = new Date($scope.dataProject.from_date);
    let toDate =  new Date($scope.dataProject.to_date);
    
    if(fromDate.getTime() >= toDate.getTime()){
      toastr.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
      return;
    }
    if($scope.dataProject.adjourn_date){
      let adjournDate = new Date($scope.dataProject.adjourn_date);
      if(toDate.getTime() >= adjournDate.getTime()){
        toastr.error("Thời gian gia hạn dự án phải lớn hơn thời gian kết thúc");
        return;
      }
    };
      ApiService.PUT("projects", $scope.dataProject).then(res => {
        swal.fire({ title: "Sửa dự án thành công", type: "success" }).then(function(result){
          if(result.value){
            $state.go('admin.project.list');
          }
        })
      });
    };
    $scope.getProject =() => {
      ApiService.GET("projects/" + $stateParams.id).then((res) => {
        $scope.dataProject= res;
        $scope.dataProject.status =$scope.dataProject.status.toString();
        $scope.dataMilestoneReports = $scope.dataProject.milestoneReports;
        if( $scope.dataMilestoneReports &&  $scope.dataMilestoneReports.length > 0 ){
          for(let i=0; i < $scope.dataMilestoneReports.length; i++) {
            if($scope.dataMilestoneReports[i].date_report)
            $scope.dataMilestoneReports[i].date_show_report =  ApiService.formatDate($scope.dataMilestoneReports[i].date_report);
          };
        };
        if($scope.dataProject.partners && $scope.dataProject.partners.length>0) {
          $scope.dataProject.partners = $scope.dataProject.partners.map(item => {
            return item.toString();
          });
        };
        $scope.$apply();
        $("#select_parner").val($scope.dataProject.partners).trigger("change");
        $("#select_center").val($scope.dataProject.center_code).trigger("change");
      });
    };
    $scope.openModalAdd =() => {
      $scope.mode="add";
      $scope.dataReportSelect={};
      $("#modal_project").modal("show");
    }
    $scope.openModalEdit =(id) => {
      $scope.dataReportSelect = $scope.dataMilestoneReports[id];
      $scope.mode="edit";
      $("#modal_project").modal("show");
    }
    $scope.updateOrAddProject = () =>  {
      if($scope.mode=="edit"){
        $scope.editReport();
      } else {
        $scope.addReport();
      }
    }
    $scope.addReport =() => {
      $scope.dataReportSelect.project_id = $stateParams.id;
      ApiService.POST("projects/milestoneReport", $scope.dataReportSelect).then(res => {
        $scope.getProject();
        $("#modal_project").modal("hide");
        swal.fire({title: 'Thêm lịch báo cáo thành công!', type:"success"});
      });
    }
    $scope.editReport =() => {
      $scope.dataReportSelect.project_id = $stateParams.id;
      ApiService.PUT("projects/milestoneReport", $scope.dataReportSelect).then(res => {
        $scope.getProject();
        $("#modal_project").modal("hide");
        swal.fire({title: 'Sửa lịch báo cáo thành công!', type: 'success'});
      });
    }
    $scope.deleteReport= (id) => {
      swal.fire({title:'Bạn chắc chắn muốn xóa lịch báo cáo này?',confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true,cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
      type: "warning"}).then(res => {
        if(res.value){
          ApiService.DELETE('/projects/milestoneReport/' +  $scope.dataMilestoneReports[id].id).then(res => {
            $scope.dataMilestoneReports.splice(id,1);
            $scope.$apply();
            toastr.success("Xóa thành công!");
          });
        };
      });
    }
    $scope.getPartner().then(() =>{$scope.getCenter().then(() => {$scope.getProject();})});
  });
})();


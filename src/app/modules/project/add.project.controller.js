(function() {
  "use strict";
  angular
  .module("MyApp")
  .controller("Add.Project.Controller", function(
    $rootScope,
    $state,
    $scope,
    ApiService,
    $compile,
    OptionService
    ) {
    $scope.dataCenter;
    $scope.dataProject={
      partners:[],
      center_code:[],
    };
    $scope.dataPartners;
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
    $scope.getPartner = () => {
     ApiService.GET("partners").then(res => {
      $scope.dataPartners=res.data;
    })
   }
   $scope.getCenter = () => {
    OptionService.getCenter().then(res => {
      $scope.dataCenter = res;
      $scope.$apply();
    });
  };
  //check thời gian
  $scope.checkTime = () => {
    
  }
  $scope.getPartner();
  $scope.getCenter();
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
    ApiService.POST("projects", $scope.dataProject).then(res => {
      swal.fire({ title: "Thêm dự án thành công", type: "success" }).then(function(result){
        if(result.value){
          $state.go('admin.project.list');
        }
      })
    });
  };
  $scope.goToList =() => {
    $state.go('admin.project.list');
  }
});
})();


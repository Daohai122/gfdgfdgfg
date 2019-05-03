
(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Add.Partner.Controller", function ($rootScope, $state, $scope,ApiService) {
    $scope.dataPartner = {
      contact_type:''
    };
    // $scope.dataProvince;
    $scope.AddPartner =() => {
      ApiService.POST('partners',$scope.dataPartner).then(res => {
        swal.fire({title:"Thêm mới đối tác thành công!", type:"success"}).then(function(result){
          if(result.value){
            $state.go('admin.partner.list');
          }
        })
      });
    };
    $scope.goToList = () => {
      $state.go("admin.partner.list");
    }
    // $scope.getProvince = () => {
    //   ApiService.GET('address/provinces').then(res => {
    //     $scope.dataProvince = res;
    //     $scope.$apply();
    //   });
    // };
    // $scope.getProvince();
    

  });
})();

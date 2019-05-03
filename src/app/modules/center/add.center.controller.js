
(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Add.Center.Controller", function ($rootScope, $state, $scope,ApiService) {
   $scope.dataCenter;
   $scope.addCenter = () => {
    ApiService.POST('centers',$scope.dataCenter).then((res) => {
      swal.fire({title: "Thêm trung tâm thành công", type:"success"}).then(function(result){
        if(result.value){
          $state.go('admin.center.list');
        }
      })
    }).catch(error => {
      // swal.fire({title:error.data.result.message, type:"error"});
    });
  }
  $scope.goToList = ()=> {
    $state.go('admin.center.list');
  };
});
})();

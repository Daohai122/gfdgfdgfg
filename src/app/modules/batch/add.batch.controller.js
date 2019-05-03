
(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Add.Batch.Controller", function ($rootScope, $state, $scope,ApiService, OptionService) {
   $scope.dataBatches;
   $scope.getCenter=() => {
    OptionService.getCenter().then(res => {
     $scope.dataCenter = res;
     $scope.$apply();
   }); 
 };
 $scope.getCenter();
   $scope.getProject=() => {
    return ApiService.GET("projects").then(res => {
     return res.data;
   }); 
  };

  $scope.addBatches = () => {
    
    ApiService.POST('Batches',$scope.dataBatches).then((res) => {
      swal.fire({title: "Thêm Khóa học thành công", type:"success"}).then(function(result){
        if(result.value){
          $state.go('admin.batch.list');
        }
      })
    });
  };
  $scope.goToList = ()=> {
    $state.go('admin.batch.list');
  }
});
})();


(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Edit.User.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService,$compile) {
    $scope.dataUser;
    $scope.$on('$viewContentLoaded', function () {
      ApiService.GET("/users/roles").then(res => {
        $scope.collaborates = res;
        for(let i=0; i< $scope.collaborates.length; i++){
          $scope.collaborates.selected= false;
        }
        $scope.getUser();
      });
     
    });
    // sử lý phần checkbox
    $scope.collaborates = [];

    $scope.selection = [];

    $scope.selectedCollaborate = function() {
      return filterFilter($scope.collaborates, { selected: true });
    };

    $scope.$watch(
      "collaborates|filter:{selected:true}",
      function(nv) {
        $scope.selection = nv.map(function(collaborates) {
          return collaborates.name;
        });
      },
      true
    );
    //ket thúc
    $scope.getUser = () => {
     ApiService.GET('users/reach/' + $stateParams.id).then(res => {
       $scope.dataUser = res;
       
       if($scope.dataUser.center_code_permissions.length > 0){
        $scope.centerChange();
      }
      if($scope.dataUser.batch_permisisons.length > 0){
        $scope.dataUser.batch_permisisons = $scope.dataUser.batch_permisisons.map(item => {
          return item.toString();
        })
        $scope.batchChange();
      }
      if($scope.dataUser.class_permissions.length > 0){
        $scope.dataUser.class_permissions = $scope.dataUser.class_permissions.map(item => {
          return item.toString();
        })
      }
       if($scope.dataUser.roleName){
          for(let i=0; i< $scope.dataUser.roleName.length; i ++){
            for(let j=0; j< $scope.collaborates.length; j++) {
              if($scope.dataUser.roleName[i] == $scope.collaborates[j].name){
                $scope.collaborates[j].selected = true;
              }
            }
          }
       }
       $scope.$apply();
     }) 
   }
   $scope.updateUser = () => {
    $scope.dataUser.roleName=$scope.selection;
    ApiService.PUT("users/updateProfileSystem", $scope.dataUser).then(res => {
      swal.fire({title: 'Cập nhật thành công!', type: "success"}).then(function(result){
        if(result.value){
          $state.go('admin.user.list');
        }
      })
    }).catch(error => {
      // swal.fire({title: error.data.result.message, type: "error"})
    }) 
  }
  // su ly phan trung tam khoa lop
  $scope.$watch('dataUser.center_code_permissions', function (newVal, oldVal) {
    if(oldVal && newVal != oldVal) {
      $scope.dataUser.batch_permisisons =[];
      $scope.dataUser.class_permissions =[];
    }
  })
  $scope.$watch('dataUser.batch_permisisons', function (newVal, oldVal) {
    if(oldVal && newVal != oldVal) {
      $scope.dataUser.class_permissions =[];
    }
  })

  $scope.centerChange =() => {
    $scope.getBatches();
  }
  $scope.batchChange =() => {
    $scope.getClass();
  }
  $scope.goToList = () => {
    $state.go('admin.user.list');
  };

  $scope.getBatches = () => {
    ApiService.GET("options/batch?lstCenterCode=" + $scope.dataUser.center_code_permissions).then(res => {
      $scope.batch = res;
      $scope.$apply();
    });
  };
  $scope.getCenter = () => {
    ApiService.GET("options/center").then(res => {
      $scope.center = res;
      $scope.$apply();
    });
  };$scope.getCenter();
  $scope.getClass = function () {
    ApiService.GET("/options/class?lstBatchId=" + $scope.dataUser.batch_permisisons).then(res => {
      $scope.class = res;
      $scope.$apply();
    }).catch(error => {
      // swal.fire({
      //   title: "Khóa học này này chưa có lớp học nào!",
      //   type: "error"
      // });
    });
  };
});
})();

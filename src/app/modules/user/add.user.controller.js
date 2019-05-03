(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Add.User.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService,$compile, OptionService) {
    $scope.$on('$viewContentLoaded', function () {
      ApiService.GET("/users/roles").then(res => {
        $scope.collaborates = res;
        for(let i=0; i< $scope.collaborates.length; i++){
          $scope.collaborates.selected= false;
        }
      });
    });
    $scope.dataUser ={
      center_code_permissions :[],
      batch_permisisons:[],
      class_permissions:[],
    };
    $scope.addUser = () => {
      $scope.dataUser.roleName = $scope.selection;
      ApiService.POST("users",$scope.dataUser).then(res => {
        swal.fire({title:"Thêm người dùng thành công!", type: "success"}).then(function(result){
          if(result.value){
            $state.go('admin.user.list');
          }
        });
      }).catch(error => {
        // swal.fire({title:error.data.result.message, type: "error"});
      });
    }
    $scope.goToList = () => {
      $state.go('admin.user.list');
    };
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

  $scope.getBatches = () => {
    OptionService.getBatch({center_codes: $scope.dataUser.center_code_permissions}).then(res => {
      $scope.batch = res;
      $scope.$apply();
    });
  };
  $scope.getCenter = () => {
    OptionService.getCenter().then(res => {
      $scope.center = res;
      $scope.$apply();
    });
  };$scope.getCenter();
  $scope.getClass = function () {
    OptionService.getClass({batchIds: $scope.dataUser.batch_permisisons}).then(res => {
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

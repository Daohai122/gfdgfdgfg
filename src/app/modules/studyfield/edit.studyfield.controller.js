(function() {
    "use strict";
    angular
    .module("MyApp")
    .controller("Edit.Studyfield.Controller", function(
      $rootScope,
      $state,
      $scope,
      ApiService,
      $compile,
      $stateParams,
      OptionService
      ) {
      $scope.dataStudyfield;
      $scope.center;
      $scope.getStudyfield =() => {
        ApiService.GET('studyField/' +$stateParams.id).then(res => {
            $scope.dataStudyfield = res;
            $scope.dataStudyfield.teachers = $scope.dataStudyfield.teachers.map(item => {
              return item.toString();
            })
            $scope.$apply();
        });
      };
      $scope.getStudyfield();
      $scope.editStudyfield =() => {
        ApiService.PUT("studyField",$scope.dataStudyfield).then(res=> {
            swal.fire({title: "Sửa ngành học thành công.", type:"success"}).then(function (result) {
              if (result.value) {
                $state.go('admin.studyfield.list');
              };
            })
        }).catch(error => {
            // swal.fire({title: error.data.result.message, type:"error"});
        });
      };
      $scope.$watch("dataStudyfield.center_code",(newValue,oldvalue) => {
        if(newValue && newValue != oldvalue) {
          let ma=$scope.dataStudyfield.code?$scope.dataStudyfield.code:"";
          $scope.dataStudyfield.name = $scope.dataStudyfield.center_code + "_"+ ma;
          $scope.$apply();
        }
      })
      $scope.$watch("dataStudyfield.code",(newValue,oldvalue) => {
        if(newValue && newValue != oldvalue) {
          let center = $scope.dataStudyfield.center_code?$scope.dataStudyfield.center_code:'';
          $scope.dataStudyfield.name = center  + "_"+ $scope.dataStudyfield.code;
          $scope.$apply();
        }
      })
      
    
      $scope.goToList =() => {
        $state.go('admin.studyfield.list');
      }
      $scope.getCenter = () => {
        OptionService.getCenter().then(res => {
          $scope.center = res;
          $scope.$apply();
        });
      };
      $scope.getCenter();
      $scope.teacher;
      $scope.getTeacher =() => {
        ApiService.GET("users/listTeacher").then(res => {
          $scope.teacher= res;
          $scope.$apply();
        });
      }
      $scope.getTeacher();
    });
  })();
  
  
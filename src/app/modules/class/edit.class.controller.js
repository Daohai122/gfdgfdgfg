
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("Edit.Class.Controller", function ($rootScope, $state, $stateParams, $scope,ApiService) {
       $scope.dataClass;
       $scope.dataBatches;
       $scope.dataStudyField;
       $scope.addTeacher = () => {
        $scope.dataClass.teachers.push('');
       };
       $scope.deleteTeacher = (id) => {
        $scope.dataClass.teachers.splice(id,1);
       };

        $scope.getBatches = () => {
        if($scope.centerCode){
          return ApiService.GET("batches?center_code=" +$scope.centerCode).then(res => {
              $scope.dataBatches = res.data;
              return res.data;
          });
        } else {
          return new Promise((resolve, rejects) => {
            resolve([]);
          });
        };
      };
        $scope.getCenter=() => {
        return ApiService.GET("centers").then(res=> {
            $scope.dataCenters= res.data;
            return res.data;
            });
        };
        // $scope.getCenter();
        $scope.getStudyField = function() {
            if($scope.centerCode){
            return ApiService.GET("studyField/getStudyFields?centerCode=" +$scope.centerCode).then(res => {
                $scope.dataStudyField = res.data;
                return res.data;
            }).catch(error => {
                // sawl.fire({title:"Trung tâm này chưa có ngành học nào!", type:"error"});
            });
            } else {
            return new Promise((resolve, rejects) => {
                resolve([]);
            });
        };
        
        };
        $scope.getClass=() => {
            ApiService.GET('classes/' + $stateParams.id).then(res => {
                $scope.dataClass = res.result;
                $scope.$apply();
            }).catch(err=> {
                console.log(err);
            });
        };
        $scope.getBatches().then(res=> $scope.getClass());
        $scope.addClass= () => {
          if($scope.dataClass.teachers.length >0) {
            for(let i = $scope.dataClass.teachers.length; i>0;i--){
              if($scope.dataClass.teachers[i] == ''){
                $scope.dataClass.teachers.splice(i,1);
              }
            }
          }
          ApiService.PUT('classes',$scope.dataClass).then(res=> {
            swal.fire({title:"Thêm lớp thành công",type:"success"})
          })
        }
        $scope.goToList = () => {
          $state.go('admin.class.list');
        }
      });
  })();
  
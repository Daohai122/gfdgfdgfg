(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Edit.User.Mobile.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService, $compile, OptionService) {
      $scope.dataUser;
      $scope.center;
      $scope.batch;
      $scope.class;
      $scope.job;
      $scope.filter = {};
      $scope.selectedStudent;
      $scope.getUser = () => {
        ApiService.GET('users/mobile/' + $stateParams.id).then(res => {
          $scope.dataUser = res;
          $scope.dataUser.type = $scope.dataUser.type.toString();
          if($scope.dataUser.type == 3) {
            $scope.dataUser.centerCode = null;
            $scope.dataUser.batch_Id = null;
            $scope.dataUser.class_Id = null;
          }
          // $scope.filter.centerCode = $scope.dataUser.centerCode;
          if($scope.dataUser.batch_Id){  $scope.filter.batch_Id = $scope.dataUser.batch_Id.toString();}
          if($scope.dataUser.class_Id){ $scope.filter.class_Id = $scope.dataUser.class_Id.toString();}
          // $scope.center = [{code: "HAN", name:"HAN"}];
          // $scope.batch = [{id: $scope.dataUser.class_Id, name:$scope.dataUser.class_Id}];
          if($scope.dataUser.batch_Id){ $scope.dataUser.batch_Id = $scope.dataUser.batch_Id.toString();}
          if($scope.dataUser.class_Id){ $scope.dataUser.class_Id = $scope.dataUser.class_Id.toString();}
          if(!$scope.dataUser.isVerify){
            $scope.getUserVerify();
          } else {
            $scope.getStudentVerify();
          }

          $scope.$apply();
          // $scope.createSelect2();
          if ($scope.dataUser.centerCode) {
            $scope.getBatches();
            $scope.getClass();
          }
          let auth = localStorage.getItem("auth");
          auth = JSON.parse(auth);
          $("#m-dropzone").dropzone({
            url: GLOBAL_CONFIG.API_URL + "/files/UploadFile",
            paramName: "file",
            maxFiles: 1,
            clickable: "#upload_img",
            acceptedFiles: ".png,.jpg",
            addRemoveLinks: true,
            dictDefaultMessage:"",
            headers: {
              'Authorization': 'Bearer ' + auth.accessToken
            },

            success: function (file, result) {
              $scope.dataUser.profileImageUrl = result.result.url
            },
            init: function () {
              if ($scope.dataUser.profileImageUrl) {
                var mockFile = {
                  name: "img.jpg",
                  size: 12345,
                  type: 'image/jpeg'
                };
                this.options.addedfile.call(this, mockFile);
                this.options.thumbnail.call(this, mockFile, GLOBAL_CONFIG.UPLOAD + $scope.dataUser.profileImageUrl);
                mockFile.previewElement.classList.add('dz-success');
                mockFile.previewElement.classList.add('dz-complete');
              }

              this.on("addedfile", function (file) {
                if (this.files.length > 1)
                  this.removeFile(this.files[0]);
                $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
                $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
                $scope.dataUser.profileImageUrl = '';
              });
              this.on("removedfile", function (file) {
                $scope.dataUser.profileImageUrl = '';
              });

            }
          });

        })
      }
      $scope.getUser();
      $scope.updateUser = () => {
        let data = Object.assign({}, $scope.dataUser);
        data.type = parseInt(data.type);
        ApiService.PUT("users/updateProfileMobile", data).then(res => {
          swal.fire({
            title: 'Cập nhật thành công!',
            type: "success"
          }).then(function (result) {
            if (result.value) {
              $state.go('admin.userMobile.list');
            }
          })
        }).catch(error => {
          // swal.fire({
          //   title: error.data.result.message,
          //   type: "error"
          // })
        })
      }

      $scope.goToList =() => {
        $state.go('admin.userMobile.list');
      }

      $scope.$watch('dataUser.centerCode', function (newVal, oldVal) {
        if(oldVal && newVal != oldVal) {
          $scope.dataUser.batch_Idd ='';
          $scope.dataUser.class_Id ='';
        }
      })
      $scope.$watch('dataUser.batch_Idd', function (newVal, oldVal) {
        if(oldVal && newVal != oldVal) {
          $scope.dataUser.class_Id ='';
        }
      })

      $scope.centerChange =() => {
        $scope.getBatches();
      }
      $scope.batchChange =() => {
        $scope.getClass();
      }
      
      $scope.getBatches = () => {
        OptionService.getBatch({center_codes: $scope.dataUser.centerCode}).then(res => {
          $scope.batch = res;
          $scope.$apply();
        });
      };
      $scope.getCenter = () => {
        OptionService.getCenter().then(res => {
          $scope.center = res;
          $scope.$apply();
        });
      };
      $scope.getCenter();
      $scope.getClass = function () {
        OptionService.getClass({batchIds: $scope.dataUser.batch_Id}).then(res => {
          $scope.class = res;
          $scope.$apply();
        }).catch(error => {
          // swal.fire({
          //   title: "Khóa học này này chưa có lớp học nào!",
          //   type: "error"
          // });
        });
      };
      
      $scope.getListJob = () => {
        ApiService.GET("jobs?user_id=" +$stateParams.id).then(res => {
          $scope.job = res.data;
          $scope.$apply();
        });
      };
      $scope.dataUserVerify;
      $scope.changeClass = () => {
        if(!$scope.dataUser.isVerify){
        $scope.getUserVerify("change_class");
        }
      }
      $scope.getUserVerify = (class_change) => {
        $scope.dataUserVerify = [];
        let query={};
        // query.phone = $scope.dataUser.phone;
        // query.batch_id = $scope.dataUser.batch_id;
        
        
        query.list_class =[$scope.filter.class_Id];
        query.SearchString = $scope.filter.SearchString;
        if(class_change) {
          query.list_class =[$scope.dataUser.class_Id]
        }
        if(query.class_Id) {
          return;
        }
        ApiService.GET("students",query).then(res => {
          let data = res.data;
          let dataUserNotVerify = [];
          // if(data.length > 0) {
          //   data.map(item => {
          //     if(!item.user_id) {
          //       dataUserNotVerify.push[item];
          //     }
          //   });
          //   data = dataUserNotVerify;
          // }
          if(data.length > 0) {
            data.map(item => {
              let name = item.last_name +' '+ item.middle_name + ' ' + item.first_name

              if(name == $scope.dataUser.name){
                $scope.dataUserVerify.push(item);
              }
            });
            if($scope.dataUserVerify.length <1) {
              data.map(item => {
                if(item.phone == $scope.dataUser.phone){
                  $scope.dataUserVerify.push(item);
                }
              });
            }
            if($scope.dataUserVerify.length <1) {
              data.map(item => {
                let dateItem = new Date(item.birthday);
                dateItem = ApiService.formatDate(dateItem);
                let dateValue= new Date( $scope.dataUser.birthday);
                dateValue = ApiService.formatDate(dateValue);
                if(dateItem == dateValue){
                  $scope.dataUserVerify.push(item);
                }
              });
            }
            if($scope.dataUserVerify.length <1) {
              $scope.dataUserVerify = res.data
            }
          } else {
            $scope.dataUserVerify = res.data
          }
          $scope.$apply();
          $('[data-toggle="m-tooltip"]').tooltip({
            placement: "top"
          });
        });
      };
      $scope.getListJob();
      $scope.verifyUser = () => {
        if(!$scope.selectedStudent) {
          toastr.error("Vui lòng chọn học viên");
          return;
        }
        let data= {
          userId: $scope.dataUser.id,
          studentId: $scope.selectedStudent
        }
        ApiService.POST("users/verify",data).then(res => {
          toastr.success("Xác nhận tài khoản thành công");
          $state.reload();
        }).catch(error => {
          // toastr.error(error.data.result.message);
        });
      }
      $scope.unVerifyUser = () => {
        let data={
          userId: $scope.dataUser.id,
          studentId: $scope.dataUser.student_id
        }
        ApiService.POST("users/unVerify", data).then(res => {
          toastr.success("Bỏ xác nhận tài khoản thành công");
          $state.reload();
        }).catch(error => {
          // toastr.error(error.data.result.message);
        });
      }
      
      $scope.selectStudent =(student) => {
        $scope.selectedStudent =  student.id;
      }
      $scope.unSelectStudent =() => {
        $scope.selectedStudent = undefined;
      }
      $scope.userVerify;
      $scope.getStudentVerify = () => {
        $scope.userVerify=[];
        if(!$scope.dataUser.student_id) {
          return;
        }
        ApiService.GET("students/" + $scope.dataUser.student_id).then(res => {
          $scope.userVerify.push(res);
          $scope.$apply();
        }); 
      }
      // sử lý phần search sinh viên
      $scope.$watch('filter.centerCode', function (newVal, oldVal) {
        if(oldVal && newVal != oldVal) {
          $scope.filter.batch_Id ='';
          $scope.filter.class_Id ='';
          // $scope.getBatchesfilter();
        }
      })
      $scope.$watch('filter.batch_Id', function (newVal, oldVal) {
        if(oldVal && newVal != oldVal) {
          $scope.filter.class_Id ='';
          // $scope.getClassfilter();

        }
      })

      $scope.centerChangefilter =() => {
        $scope.getBatchesfilter();
      }
      $scope.batchChangefilter =() => {
        $scope.getClassfilter();
      }
      $scope.classfilter;
      $scope.batchfilter;
      $scope.centerfilter;

      $scope.getBatchesfilter = () => {
        OptionService.getBatch({center_codes: $scope.filter.centerCode}).then(res => {
          $scope.batchfilter = res;
          $scope.$apply();
        });
      };
      $scope.getCenterfilter = () => {
        OptionService.getCenter().then(res => {
          $scope.centerfilter = res;
          $scope.$apply();
        });
      };
      $scope.getCenterfilter();
      $scope.getClassfilter = function () {
          OptionService.getClass({batchIds: $scope.filter.batch_Id}).then(res => {
          $scope.classfilter = res;
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

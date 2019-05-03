(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Account.Profile.Controller", function(
      $rootScope,
      $state,
      $scope,
      ApiService,
      AuthService
    ) {
      $scope.$on('$viewContentLoaded', function () {
        // ApiService.GET("/accounts/roles").then(res => {
        //   $scope.collaborates = res;
        //   for(let i=0; i< $scope.collaborates.length; i++){
        //     $scope.collaborates.selected= false;
        //   }
        // });
        $scope.getInforAccount();
      });
       // sử lý phần checkbox
      // $scope.collaborates = [];

      // $scope.selection = [];

      // $scope.selectedCollaborate = function() {
      //   return filterFilter($scope.collaborates, { selected: true });
      // };

      // $scope.$watch(
      //   "collaborates|filter:{selected:true}",
      //   function(nv) {
      //     $scope.selection = nv.map(function(collaborates) {
      //       return collaborates.name;
      //     });
      //   },
      //   true
      // );
      //ket thúc
      // xây dựng upload ảnh
      $scope.editImage = () => {
        let auth = localStorage.getItem("auth");
        auth = JSON.parse(auth);
        $("#m-dropzone").dropzone({
          url: GLOBAL_CONFIG.API_URL + "/files/UploadFile",
          paramName: "file",
          clickable: "#upload_img",
          maxFiles: 1,
          acceptedFiles: ".png,.jpg",
          addRemoveLinks: true,
          headers: {
            'Authorization': 'Bearer ' + auth.accessToken
          },
          
          success: function(file, result) {
            $scope.dataUser.profileImageUrl = result.result.url;
          },
          init: function() {
            if ($scope.dataUser.profileImageUrl) {
              var mockFile = {
                name: "img.jpg",
                size: 12345,
                type: "image/jpeg"
              };
              this.options.addedfile.call(this, mockFile);
              this.options.thumbnail.call(
                this,
                mockFile,
                GLOBAL_CONFIG.UPLOAD+$scope.dataUser.profileImageUrl
              );
              mockFile.previewElement.classList.add("dz-success");
              mockFile.previewElement.classList.add("dz-complete");
            }
            this.on("addedfile", function(file) {
              if (this.files.length > 1)
              this.removeFile(this.files[0]);
              $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
              $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
              $scope.dataUser.profileImageUrl='';
            });
            this.on("removedfile", function(file) {
              $scope.dataUser.profileImageUrl='';
            });
          }
        });
      };
      $scope.dataUser;
      $scope.password;
      $scope.getInforAccount = function() {
        ApiService.GET("accounts/MyInformation").then(res => {
          $scope.dataUser = res;
          // if($scope.dataUser.roleName){
          //   for(let i=0; i< $scope.dataUser.roleName.length; i ++){
          //     for(let j=0; j< $scope.collaborates.length; j++) {
          //       if($scope.dataUser.roleName[i] == $scope.collaborates[j].name){
          //         $scope.collaborates[j].selected = true;
          //       }
          //     }
          //   }
        //  }
          $scope.editImage();
          $scope.$apply();
        });
      };
      /**
       * Cập nhật thông tin tài khoản
       */
      $scope.updateMyProfile = function() {
        // $scope.dataUser.roleName = $scope.selection;
        ApiService.PUT("accounts/updateProfile", $scope.dataUser).then(() => {
          swal.fire({ title: "Cập nhật thành công", type: "success" }).then(function(result){
            if(result.value){
              $state.go($state.current, {}, {reload: true});
            }
          });
        }).catch(error => {
          // swal.fire({title: error.data.result.message, type:"error"})
        });
      };

      $scope.changePassword = function() {
        if ($scope.password.newPassword != $scope.password.confirmNewPassword) {
          swal.fire({ title: "Mật khẩu mới chưa giống nhau", type: "error" });
        } else {
          ApiService.POST("accounts/ChangePassword", $scope.password).then(
            function() {
              $("#m_modal_1").modal("hide");
              swal.fire({ title: "Cập nhật thành công", type: "success" });
              $state.go('admin');
            }
          );
        }
      };
      $scope.goToList = () => {
        $state.go('admin')
      }
    });
})();


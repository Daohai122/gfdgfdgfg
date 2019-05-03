(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("List.Categories.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService) {
      $scope.$on("$viewContentLoaded", function () {
        $scope.getArticleCategories();
        $scope.getGroupUser();
      });
      $scope.currentSelectedItem = {};
      $scope.dataUserGroup;
      let uploadImge;

      $scope.initDrop = function () {
        if (uploadImge) {
          {
            uploadImge.removeAllFiles()
            uploadImge.destroy()
          }
        }
        setTimeout(() => {
          let auth = localStorage.getItem("auth");
          auth = JSON.parse(auth);
          uploadImge = new Dropzone("#m-dropzone", {
            url: GLOBAL_CONFIG.API_URL + "/files/UploadFile",
            paramName: "file",
            clickable: "#upload_img",
            maxFiles: 1,
            acceptedFiles: ".png,.jpg",
            addRemoveLinks: true,
            dictDefaultMessage: "",
            headers: {
              'Authorization': 'Bearer ' + auth.accessToken
            },
            success: function (file, result) {
              $scope.currentSelectedItem.featureImageUrl = result.result.url
            },

            removedfile: function (file) {
              $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
              $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
              $scope.currentSelectedItem.featureImageUrl = '';
            },
            init: function () {
              $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
              if ($scope.mode == "edit" && $scope.currentSelectedItem.featureImageUrl) {
                $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
                var mockFile = {
                  name: "img.jpg",
                  size: 12345,
                  type: 'image/jpeg'
                };
                this.options.addedfile.call(this, mockFile);
                this.options.thumbnail.call(this, mockFile, GLOBAL_CONFIG.UPLOAD + $scope.currentSelectedItem.featureImageUrl);
                mockFile.previewElement.classList.add('dz-success');
                mockFile.previewElement.classList.add('dz-complete');
              }
              this.on("addedfile", function (file) {
                if (this.files.length > 1)
                  this.removeFile(this.files[0]);
                $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
                $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
                $scope.currentSelectedItem.featureImageUrl = '';
              });

            },
            // addedfile: function(file) {
            //   debugger;
            //   // if (this.files.length > 1){
            //   //   this.removeFile(this.files[0]);
            //   // }        
            // },
          });
        }, 400)

      }
      $scope.getArticleCategories = () => {
        ApiService.GET("articleCategories").then(res => {

          $scope.categories = res.data

          $scope.categories.map(item => {
            item.allowedUserGroups = item.allowedUserGroups.map(group => {
              return group.toString();
            });
            return item;
          });

          $scope.$apply();
          $scope.initSortable();
        })
      }

      $scope.getGroupUser = () => {
        ApiService.GET("userGroup?Limit=999").then(res => {
          $scope.dataUserGroup = res.data;
        });
      }

      $scope.initSortable = function () {
        $("#sortable-category").sortable({
          handle: ".item-handle",
          cursor: "move",
          beforeStop: function (event, ui) {
            let currentIndex = parseInt($(ui.item[0]).attr("data-index"));
            let changeIndex = $("#sortable-category .btn.text-left").index(ui.item[0]);
            console.log(currentIndex, changeIndex)
            $scope.currentSelectedItem = $scope.categories[currentIndex];
            $scope.currentSelectedItem.priority = changeIndex;
            $scope.updateCategories(true);
          }
        });
      }

      $scope.selectItem = function (index) {
        $scope.currentSelectedItem.selected = false;
        $scope.categories[index].selected = true;
        $scope.currentSelectedItem = $scope.categories[index];
        
        $scope.mode = "edit";
        $scope.initDrop();
      }

      $scope.initAddForm = function () {
        $scope.currentSelectedItem.selected = false;
        $scope.currentSelectedItem = {};
        $scope.currentSelectedItem.allowedUserGroups=[];
        $scope.mode = "add";
        $scope.initDrop(true);
      }

      $scope.deleteCategories = () => {
        swal.fire({
          title: "Bạn chắc chắn muốn xóa?",
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          showCancelButton: true,
          cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: "warning"
        }).then(res => {
          if (res.value) {
            ApiService.DELETE("articleCategories/" + $scope.currentSelectedItem.id).then(() => {
              toastr.success("Xóa thành công");
              $scope.getArticleCategories();
              $scope.mode = '';
            }).catch(error => {
              // swal.fire({title:error.data.result.message, type:"error"});
            });
          }
        })
      }
      $scope.updateCategories = function (data) {
        if ($scope.mode == "edit" || data) {
          ApiService.PUT("articleCategories", $scope.currentSelectedItem).then((res) => {
            toastr.success("Cập nhật thành công");
            $scope.getArticleCategories();
          })
        } else if ($scope.mode == "add") {
          ApiService.POST("articleCategories", $scope.currentSelectedItem).then((res) => {
            swal.fire({
              title: "Thêm mới thành công",
              type: 'success'
            });
            $scope.initAddForm();
            $scope.getArticleCategories();
          })
        }

      }
    });
})();

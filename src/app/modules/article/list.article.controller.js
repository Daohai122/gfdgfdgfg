(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("List.Article.Controller", function ($rootScope, $state, $scope, ApiService, $compile, $location) {
      $scope.$on("$viewContentLoaded", function () {
        $scope.getCategory();
      });
      $scope.dataArticle;
      $scope.dataCategories;
      $scope.reloadTable = 1;
      $scope.getCategory = function () {
        return new Promise((resolve, rejects) => {
          ApiService.GET('options/articleCategory').then(res => {
            $scope.dataCategories = res;
            $scope.$apply();
            resolve(true);
          });
        })

      }
      $scope.getCategory();
      $scope.tableConfig = {
        requestUrl: "articles",
        columns: [
          {
            data:null,
            title:"STT",
            class:"text-center",
            render: function (data, type, full, meta) {
              return Number(meta.settings._iDisplayStart) + meta.row + 1;
            }
          },
          {
            data: "categoryTitle",
            title: "Danh mục",
            orderable: true,
            class: "text-align"
          },
          {
            data: "featureImageUrl",
            title: "Hình ảnh",
            class: "text-center",
            render: (data) => {
              if (data) {
                return '<img class="m--marginless" alt="" height="75px" style="padding:5px; object-fit: cover;" width="100px" src="' + GLOBAL_CONFIG.UPLOAD + data + '">'
              } else {
                return '';
              }
            }
          },
          {
            data: null,
            title: "Tiêu Đề",
            orderable: true,
            class: "text-align",
            render: (data) => {
              if (data.title.length > 60) {
                return "<a ui-sref='admin.article.edit({id: " + data.id + "})'>" + data.title.substring(0, 60) + '...' + "</a>"
              } else {
                return "<a ui-sref='admin.article.edit({id: " + data.id + "})'>" + data.title + "</a>";
              }
            },
            fnCreatedCell: function (celContent, sData) {
              $compile(celContent)($scope);
            }
          },
          {
            data: "language",
            title: "Ngôn ngữ",
            orderable: true,
            class: "text-center",
            render: (data) => {
              if (data == 0) {
                return "Tiếng Việt";
              } else {
                return "Tiếng Anh"
              }
            }
          },
          {
            data: null,
            title: "Hiển thị",
            orderable: true,
            class: "text-center",
            render: (data, type, full, meta) => {
              return `<span class="m-switch m-switch--icon "><label>
                <input ng-model="dataArticle[${meta.row}].isVisible" ng-click="updatePublished('${meta.row}')" type="checkbox"><span></span></label>
                </span>`;
            },
            fnCreatedCell: function (celContent, sData) {
              $compile(celContent)($scope);
            }
          },
          {
            data: null,
            title: "Phê duyệt",
            orderable: true,
            class: "text-center",
            render: (data, type, full, meta) => {
              return `<span class="m-switch m-switch--icon "><label>
                <input ng-model="dataArticle[${meta.row}].isApproved" ng-click="updateApproved('${meta.row}')" type="checkbox"><span></span></label>
                </span>`;
            },
            fnCreatedCell: function (celContent, sData) {
              $compile(celContent)($scope);
            }
          },

          {
            data: null,
            orderable: false,
            title: "Hành Động",
            class: "text-center",
            render: function (data) {
              return (
                '<a ui-sref="admin.article.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                '<a href="javascript:;" ng-click="deleteArticles(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
              );
            },
            fnCreatedCell: function (celContent, sData) {
              $compile(celContent)($scope);
            }
          }
        ],
        fnDrawCallback: function (oSettings) {
          $('[data-toggle="m-tooltip"]').tooltip({
            placement: "auto"
          });
        }
      };
      $scope.goToAdd = function () {
        $state.go('admin.article.add');
      }
      $scope.updatePublished = (index) => {
        let data = $scope.dataArticle[index];
        swal.fire({
          title: "Bạn chắc chắn muốn thay Đổi?",
          confirmButtonText: 'Có',
          cancelButtonText: 'Hủy',
          showCancelButton: true,
          cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: 'warning',
        }).then(res => {
          if (res.value) {
            ApiService.PUT("/articles/SetVisible", {
              id: data.id,
              isVisible: data.isVisible
            }).then(res => {
              toastr.success("Cập nhật thành công");
            });
          }
          if (res.dismiss == "cancel") {
            console.log(res);
            $scope.dataArticle[index].isVisible = !$scope.dataArticle[index].isVisible;
            $scope.$apply();
          };
        });
      }
      $scope.updateApproved = (index) => {
        let data = $scope.dataArticle[index];
        swal.fire({
          title: "Bạn chắc chắn muốn thay đổi trạng thái hiển thị?",
          confirmButtonText: 'Có',
          cancelButtonText: 'Hủy',
          showCancelButton: true,
          cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: 'warning',
        }).then(res => {
          if (res.value) {
            ApiService.PUT("/articles/SetApproved", {
              id: data.id,
              isApproved: data.isApproved
            }).then(res => {
              toastr.success("Cập nhật thành công");
            });
          }
          if (res.dismiss == "cancel") {
            console.log(res);
            $scope.dataArticle[index].isApproved = !$scope.dataArticle[index].isApproved;
            $scope.$apply();
          };
        });
      }

      $scope.deleteArticles = function (id) {
        $('[data-toggle="m-tooltip"]').tooltip('hide');
        Swal.fire({
          title: 'Bạn chắc chắn xóa?',
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          showCancelButton: true,
          cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: "warning"
        }).then(result => {
          if (result.value) {
            ApiService.DELETE("articles/" + id).then(res => {
              $scope.reloadTable++;
              $scope.$apply();
              toastr.success("Xóa thành công!");
            });
          }
        });
      }

    });
})();

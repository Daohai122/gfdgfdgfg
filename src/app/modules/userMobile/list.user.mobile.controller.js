
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.User.Mobile.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService,$compile,$location) {
        $scope.reloadTable=1;
        $scope.dataUser;
        $scope.tableConfig = {
            requestUrl: "users/ListUserMobile",
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
                data: name,
                orderable: true,
                title: "Tên",
                render: (data, type, full, meta) => {
                  return "<a ui-sref='admin.userMobile.edit({id: "+full.id+"})'>" + full.name + "</a>";
                },
                fnCreatedCell: function (celContent, sData) {
                  $compile(celContent)($scope);
                }
              },
              {
                data: "emailAddress",
                orderable: true,
                title: "Email",
              },
              {
                data: "type",
                title: "Vai trò",
                orderable: true,
                render: (data) => {
                  let view = {1:"Student",2:"Cựu học viên",3:"Khách"};
                  return view[data]
                }
              },
              {
                data: "phone",
                orderable: true,
                title: "Số điện thoại",
                defaultContent: "",
              },
              {
                data:null,
                title:"Trạng thái",
                class: "text-center",
                render: (data, type, full, meta) => {
                  return `<span class="m-switch m-switch--icon "><label>
                    <input ng-model="dataUser[${meta.row}].isActive" ng-click="updateApproved('${meta.row}')" type="checkbox"><span></span></label>
                    </span>`;
                },
                fnCreatedCell: function (celContent, sData) {
                  $compile(celContent)($scope);
                }
              },
              { data:"isVerify",
              orderable: true,
                title:"Tình trạng",
                class: "text-center",
                render: (data, type, full, meta) => {
                  if(full.type != 3) {
                    if(data) {
                      return "Đã xác nhận";
                    } else {
                      return "Chưa xác nhận";
                    }
                  } else {
                    return '';
                  }
                  
                }
              },
              {
                data: null,
                title: "Hành Động",
                class:"text-center",
                render: function (data) {
                  let viewVerify='';
                  
                  return (
                    viewVerify+
                    '<a ui-sref="admin.userMobile.edit({id: '+data.id+'})"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteUser('+data.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
                  );
                },
                fnCreatedCell: function (celContent, sData) {
                  $compile(celContent)($scope);
                }
              }
            ],
            fnDrawCallback: function (oSettings) {
              $('[data-toggle="m-tooltip"]').tooltip({
                  placement: 'auto',
              });
            }
          };
          
        $scope.deleteUser = (id) => {
          $('[data-toggle="m-tooltip"]').tooltip('hide');
          swal.fire({title:"Bạn chắc muốn xóa?",confirmButtonText:  'Xóa', type: "warning", cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: "warning" }).then(res => {
            if(res.value){
              ApiService.DELETE("accounts/" +id).then(res => {
                  $scope.reloadTable ++;
                  $scope.$apply();
                  toastr.success("Xóa người dùng thành công!");
              });
            }
          });
        }
        $scope.verifyUser = (id) => {
          swal.fire({title:"Bạn chắc chắc chắn Verify người dùng này?",confirmButtonText:  'Có', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: 'warning',}).then(res => {
            if(res.value){
              $('[data-toggle="m-tooltip"]').tooltip('hide');
              ApiService.POST("accounts/verify/" +id).then(res => {
                $scope.reloadTable ++;
                $scope.$apply();
                toastr.success("Verify người dùng thành công!");
            }).catch(error => {
              // swal.fire({title: error.data.result.message, type:"error"})
            });
            }
            
          });
          
        }
        $scope.updateApproved = (index) => {
          let data = $scope.dataUser[index];
          let url;
          if(data.isActive){
            url ='users/SetActived/';
          } else {
            url ='users/SetBlocked/';
          }
          swal.fire({title:"Bạn chắc chắn muốn thay đổi trạng thái hiển thị?",confirmButtonText:  'Có',
           cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
           type: 'warning',}).then(res => {
            if(res.value) {
              ApiService.PUT(url + data.userName).then(res => {
                toastr.success("Cập nhật thành công!");
              });
            }
            if( res.dismiss == "cancel") {
              $scope.dataUser[index].isActive = !$scope.dataUser[index].isActive;
              $scope.$apply();
            }
          });
        }
        $scope.goToAdd = (id) => {
          $state.go("admin.userMobile.add");
        }
      });
  })();
  
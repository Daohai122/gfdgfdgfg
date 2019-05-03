
(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Permission.Controller", function ($rootScope, $state, $scope, ApiService, $stateParams) {
      $scope.$on("$viewContentLoaded", function () {

        $scope.init();
        

      });
      $scope.init = () => {
        $scope.getAllPermission().then(resp => {
          $scope.getRoles().then(result => {
            if ($stateParams.role) {
              var roleIndex = $scope.roles.findIndex(item => {
                return item.name == $stateParams.role;
              });
              $scope.selectRole(roleIndex);
            }
          });
        })
      }

      $scope.actions = ["View", "Create", "Edit", "Delete"];
      $scope.currentSelectedRole = {};
      $scope.roles = [];
      /**
       * Lấy về danh sách role trên hệ thống
       */
      $scope.getRoles = function () {
        return ApiService.GET("permissions/roles").then(function (resp) {
          $scope.roles = resp;
          $scope.$apply();
          return resp;
        });
      }


      /**
       * Lấy về danh sách các permission Trên hệ thống
       */
      $scope.getAllPermission = function () {
        return ApiService.GET("permissions/GetAllPermissions").then(function (res) {

          let permissions = [];
          res.forEach(item => {

            let perItem = {
              name: item.name,
              displayName: item.displayName
            };
            item.actions.forEach(action => {
              perItem[action] = false;
            });

            permissions.push(perItem);
          });

          $scope.permissions = permissions;
          return permissions;
        });
      }

      $scope.indexSelect;
      $scope.selectRole = function (index) {
        $scope.indexSelect= index;
        
        $scope.currentSelectedRole.selected = false;
        $scope.roles[index].selected = true;
        $scope.currentSelectedRole = $scope.roles[index];
        // $scope.$apply();
        // $location({
        //   role: $scope.roles[index].name
        // });

        $state.go($state.current.name, {
          role: $scope.roles[index].name
        }, {
          notify: false
        });

        $scope.resetPermissionSelection();
        $scope.getPermissionsByRole($scope.roles[index].id).then(resp => {

          //Lấy về danh sách tất cả các permisson được cấp phép
          let permissionByRoles = [];
          resp.forEach(item => {
            if (item.isGranted) {
              permissionByRoles.push(item.name);
            }
          });

          $scope.applyPermissions(permissionByRoles);

          $scope.$apply();
        })
      }

      /**
       * Khởi tạo giá trị cho cac permission theo danh sách các permision được truyền vào
       */
      $scope.applyPermissions = function (permisisonNames) {
        $scope.permissions.forEach(item => {
          let isSelectAll = true;
          $scope.actions.forEach(action => {
            if (permisisonNames.indexOf(item.name + "." + action) >= 0) {
              item[action] = true;
            } else {
              if (item.hasOwnProperty(action)) {
                isSelectAll = false;
              }
            }
          });
          item.All = isSelectAll;
        });
      }

      /**
       * Bỏ chọn tất cả các permission
       */
      $scope.resetPermissionSelection = function () {
        $scope.permissions.forEach(item => {
          $scope.actions.forEach(action => {
            if (item.hasOwnProperty(action)) {
              item[action] = false;
            }
          });
        });
      }

      $scope.getPermissionsByRole = function (roleId) {
        return ApiService.GET("permissions/getPermissionsByRole/" + roleId).then(resp => {
          return resp;
        });
      }

      $scope.updatePermission = function () {

        var permissionNames = [];
        $scope.permissions.forEach(item => {
          $scope.actions.forEach(action => {
            if (item[action] == true) {
              permissionNames.push(item.name + "." + action);
            }
          });
        });

        ApiService.POST("permissions/setDefaultPermissionsForRole", {
          permissionNames: permissionNames,
          roleId: $scope.currentSelectedRole.id
        }).then(resp => {
          toastr.success("Cập nhật thành công");
        })
      }

      $scope.toggleCheckAll = function (permision) {
        var newValue = permision.All;
        $scope.actions.forEach(action => {
          if (permision.hasOwnProperty(action)) {
            permision[action] = newValue;
          }
        });
        permision.All = newValue;
      }

      $scope.myContextDiv = "<ul class='nav' id='contextmenu-node'><li class=' nav-item contextmenu-item' ng-click='clickedDelete(this)'> Xóa </li><li class='nav-item contextmenu-item' ng-click='clickedEdit()'> Sửa </li></ul>";
      $scope.clickedDelete = function (e) {
        setTimeout(() => {
          swal.fire({title:"Bạn chắc chắn muốn xóa quyền này", confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom", type: "warning"}).then(res => {
            if(res.value) {
              $scope.deleteRoles($scope.indexSelect);
            };
          });
          
        },300)
       
      };
      $scope.clickedEdit = function () {
        $scope.modeRole = 'edit';
        setTimeout(() => { 
          $scope.roleNew = $scope.roles[$scope.indexSelect];
          $scope.roleNew.isStatic = $scope.roleNew.isStatic.toString();
          $scope.$apply();
          $("#m_modal_permission").modal("show");
        },300)
       
      };
      
      
      // thêm sửa xóa quyền
      $scope.modeRole;
      $scope.roleNew;

      $scope.openModeladd =function (item) {
        $scope.modeRole ="add";
        $scope.roleNew={};
        $("#m_modal_permission").modal("show");
      }

      $scope.updateRoles = () => {
        ApiService.PUT("roles",$scope.roleNew).then(res=>{
          toastr.success("Sửa quyền thành công");
          $("#m_modal_permission").modal("hide");
          $scope.init();
        });
      }

      $scope.updateAndAddRoles = () => {
        if($scope.modeRole == 'add') {
          $scope.addRoles()
        }  else {
          $scope.updateRoles();
        }
      }
      $scope.deleteRoles = (id) => {
        ApiService.DELETE("roles/" + id).then(res => {
          toastr.success("Xóa quyền thành công");
         
        })
      }
      $scope.addRoles = () => {
        ApiService.POST('roles', $scope.roleNew).then(res => {
          toastr.success("Thêm quyền thành công");
          $("#m_modal_permission").modal("hide");
          $scope.init();
        })
      }
    });
})();

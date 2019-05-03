
(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("List.Group.User.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService,$compile, $location) {
		$scope.$on("$viewContentLoaded", function() {
			$scope.getUserGroup();
        })

		$scope.groupCode;
        $scope.userSearch = "";
        $scope.inGroupSearch = "";

		$scope.getUserGroup = () => {
			ApiService.GET("userGroup?limit=100").then(res => {
				$scope.dataUserGroup = res.data;
				if (!$scope.groupCode && $scope.dataUserGroup) {
					$scope.groupCode = $scope.dataUserGroup[0].id.toString();
				}
			})
		}

		$scope.getUserMobile = () => {
            ApiService.GET('users/ListUserMobile?limit=1000000&SearchString=' + $scope.userSearch).then(res => {
                $scope.dataUserMobileList = res.data;
                $scope.dataUserMobile = [];
                $scope.dataUserMobileList.map(function(item, idx) {
                	var findId = $scope.dataUserForGroup.filter(x => x.user_id == item.id);
                	if (findId.length < 1) {
                		$scope.dataUserMobile.push(item);
                	}
                })
                $scope.$apply();
            });
        }

		$scope.getGroup = () => {
            if(!$scope.groupCode){
                return;
            }
			ApiService.GET('userGroup/getGroupById?groupId=' + $scope.groupCode).then(res => {
                $scope.dataGroup = res;
                $scope.getUserForGroup('init');
            });
		}

		$scope.getUserForGroup = (type) => {
            if(!$scope.groupCode) {
                $scope.groupCode="";
            }
            ApiService.GET("/userGroup/userGroupRelation?user_group_id=" + $scope.groupCode + "&SearchString=" + $scope.inGroupSearch).then(res => {
                $scope.dataUserForGroup = res.data;
                if (type == 'init') {
                    $scope.getUserMobile();
                }
                $scope.$apply();
            });
        }

        const ps = new PerfectScrollbar('.scroll_table', { });

        $scope.openModal = () => {
        	$scope.dataAddGroup = {};
        	$('#addGroupModal').modal();
        }

        $scope.deleteGroup = () => {
        	$scope.dataAddGroup = {};
        	swal.fire({title:"Bạn chắc muốn xóa?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true,cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
            type: "warning" }).then(res => {
        		if(res.value){
        			ApiService.DELETE("/userGroup?group_id=" + $scope.groupCode).then(res => {
        				$scope.groupCode = $scope.dataUserGroup[0].id.toString();
        				$scope.$apply();
        				toastr.success("Xóa nhóm người dùng thành công!");
        			}).catch(error => {
        				// Swal.fire({title:error.data.result.message, type: "error"});
        			});
        		}
        	});
        }

        $scope.addGroup = () => {
            ApiService.POST("userGroup", $scope.dataAddGroup).then(res => {
            	$('#addGroupModal').modal('hide');
            	$scope.groupCode = res.toString();
            	$scope.$apply();
                toastr.success("Thêm nhóm thành công");
            });
        }

        $scope.updateGroup = () => {
            ApiService.PUT("userGroup",$scope.dataGroup).then(res => {
				$scope.getGroup();
				$scope.getUserGroup();
                toastr.success("Sửa nhóm thành công");
            });
        }

        $scope.show =() => {
            let data={
                user_group_id: $scope.groupCode,
                lstUserIds:[]
            }
            $scope.dataUserMobile.map(item=> {
                if(item.value){
                    data.lstUserIds.push(item.id);
                }
            });
            if(data.lstUserIds.length < 1) {
                toastr.error('Vui lòng chọn người dùng.');
                return;
            }
            ApiService.POST("userGroup/addUserIntoGroup",data).then(res=> {
                toastr.success("Thêm người dùng vào nhóm thành công.");
				$scope.getGroup();
				$scope.getUserGroup();
            });
        }

        $scope.removeUser = () => {
            let data= {
                user_group_id: $scope.groupCode,
                lstUserIds:[]
            }
            $scope.dataUserForGroup.map(item => {
                if(item.value) {
                    data.lstUserIds.push(item.user_id);
                }
            })
            if(data.lstUserIds.length < 1) {
                toastr.error('Vui lòng chọn người dùng để xóa.');
                return;
            }
            ApiService.POST("userGroup/deleteUserIntoGroup",data).then(res=> {
                toastr.success("Xóa người dùng khỏi nhóm thành công.");
				$scope.getGroup();
				$scope.getUserGroup();
            });
        }

		$scope.$watch("groupCode", function(change) {
			if (change != undefined) {
				$scope.getGroup();
				$scope.getUserGroup();
			}
		}, true)
    });
})();

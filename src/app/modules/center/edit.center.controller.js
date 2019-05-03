
(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Edit.Center.Controller", function ($rootScope,$stateParams, $state, $scope,ApiService) {
		$scope.dataCenter;
		$scope.formMode = 'create';

		$scope.getCenter = () => {
			ApiService.GET("centers/" + $stateParams.id).then((res) => {
				$scope.dataCenter =res;
				$scope.dataCenter.region =$scope.dataCenter.region.toString();
				$scope.getCenterSE();
				$scope.$apply();
			}) 
		}
		$scope.getCenter();


		$scope.updateCenter= () => {
			ApiService.PUT("centers",$scope.dataCenter ).then((res) => {
				swal.fire({title: 'Cập nhập trung tâm thành công!', type: "success"}).then(function(result){
					if(result.value){
						$state.go('admin.center.list');
					}
				});
			}).catch(error => {
				// toastr.error(error.data.result.message);
			});
		}
		$scope.getCenterSE = () => {
			ApiService.GET("centersSE?centerCode=" + $scope.dataCenter.code).then((res) => {
				$scope.dataCenterSE = res.data;
				if($scope.dataCenterSE && $scope.dataCenterSE.length > 0 ){
					for(let i=0; i< $scope.dataCenterSE.length; i++) {
						$scope.dataCenterSE[i].build_date_show = ApiService.formatDate($scope.dataCenterSE[i].build_date);
					}
				}
				
				$scope.$apply();
				$('[data-toggle="m-tooltip"]').tooltip({
		            placement: "auto"
		        });
			});
		}
		$scope.goToList = () =>{
			$state.go('admin.center.list');
		};

		$scope.addCenterSE = () => {
			$scope.dataNewCenter.status = false;
			$scope.dataNewCenter.center_code = $scope.dataCenter.code;
			ApiService.POST("centersSE",$scope.dataNewCenter ).then((res) => {
				$scope.getCenterSE();
				swal.fire({title: 'Thêm mới doanh nghiệp xã hội thành công', type: "success"}).then(function(result){
					if(result.value){
						$scope.getCenterSE();
						$('#centerSEModal').modal('hide');
					}
				});
			});
		}
		$scope.updateStatus = (idx) => {
			ApiService.PUT("centersSE",$scope.dataCenterSE[idx] ).then((res) => {
				$scope.getCenterSE();
				swal.fire({title: 'Cập nhật trạng thái doanh nghiệp xã hội thành công', type: "success"}).then(function(result){
					$('#centerSEModal').modal('hide');
				});
			});
		}
		$scope.addCenterSe = () => {
			$scope.dataNewCenter={}
			$('#centerSEModal').modal('show');
		}
		$scope.submitForm = () => {
			if ($scope.formMode == 'create') {
				$scope.addCenterSE();
			} else {
				$scope.editCenterSE();
			}
		}

		$scope.updateModal = (idx) => {
			$scope.formMode = 'update';
			$scope.dataNewCenter = $scope.dataCenterSE[idx];
			$('#centerSEModal').modal('show');
		}

		$scope.editCenterSE = () => {
			ApiService.PUT("centersSE",$scope.dataNewCenter ).then((res) => {
				$scope.getCenterSE();
				swal.fire({title: 'Cập nhật doanh nghiệp xã hội thành công', type: "success"}).then(function(result){
					$scope.getCenterSE();
					$('#centerSEModal').modal('hide');
				});
			}).catch(error=> {
				// swal.fire({title:error.data.result.message, type:"error"});
			})
		}

		$scope.deleteCenterSE = (idx) => {
			let id = $scope.dataCenterSE[idx].id;
			$('[data-toggle="m-tooltip"]').tooltip('hide');
            swal.fire({title:"Bạn chắc chắn muốn xóa doanh nghiệp xã hội này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom", type: "warning"}).then(res => {
                if(res.value) {
                    ApiService.DELETE('centersSE/'+id).then(res => {
                      $scope.getCenterSE();
                      $scope.$apply();
					  toastr.success("Xóa thành công");
                    });
                };
            });
		}
	});
})();

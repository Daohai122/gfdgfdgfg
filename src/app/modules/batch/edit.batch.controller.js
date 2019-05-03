
(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Edit.Batch.Controller", function ($rootScope, $state, $scope,ApiService, $stateParams, OptionService) {
		$scope.dataBatches;
		$scope.dataClass;
		$scope.centerCode;
		$scope.dataStudyField;
		$scope.formMode = 'create';
		$scope.dataCenter;
		$scope.getCenter=() => {
			 OptionService.getCenter().then(res => {
				$scope.dataCenter = res;
				$scope.$apply();
			}); 
		};
		$scope.getCenter();

		$scope.getProject=() => {
			return ApiService.GET("projects").then(res => {
				return res.data;
			}); 
		};
		$scope.getBatches = () => {
			ApiService.GET("batches/" + $stateParams.id).then(res => {
				$scope.dataBatches = res;
				$scope.centerCode = $scope.dataBatches.center_code;
				$scope.getClass();
				$scope.getStudyField();
		// $scope.$apply();
		});
		};

		$scope.getClass = () => {
			let dataClass={lstBatchId:[$scope.dataBatches.id]}
        	ApiService.GET("classes/getClassByListBatchId", dataClass).then(res => {
				$scope.dataClass = res;
				$scope.$apply();
				$('[data-toggle="m-tooltip"]').tooltip({
		            placement: "auto"
				});
			});
		};
		$scope.getBatches();
		$scope.editBatches = () => {
			if($scope.dataBatches.to){
				let toTime= new Date($scope.dataBatches.to);
				let fromTime = new Date($scope.dataBatches.from);
				if(fromTime.getTime() >= toTime.getTime()) {
				  toastr.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");
				  return;
				}
			  }
			  if($scope.dataBatches.start_time && $scope.dataBatches.to){
				let actionTime = new Date($scope.dataBatches.start_time);
				let toTime = new Date($scope.dataBatches.to);
				if(actionTime.getTime() >= toTime.getTime()){
				  toastr.error("Thời gian tuyển sinh phải nhỏ hơn thời gian kết thúc!");
					return;
				}
			  }
			ApiService.PUT('batches',$scope.dataBatches).then((res) => {
				swal.fire({title: "Sửa khóa học thành công", type:"success"}).then(function(result){
					if(result.value){
						$state.go('admin.batch.list');
					}
				})
			});
		};
		$scope.goToList= () =>{
			$state.go('admin.batch.list');
		};
		$scope.getStudyField = function() {
			ApiService.GET("studyField/?centerCode=" + $scope.centerCode).then(res => {
				$scope.dataStudyField = res.data;
			})
		};

		$scope.addClass = () => {
			$scope.dataNewClass.batch_id = $scope.dataBatches.id;
			if(!$scope.dataNewClass.from_date) {
				toastr.error("Bạn chưa nhập thời gian bắt đầu lớp học!");
          		return;
			}
			$scope.dataNewClass.code = $scope.dataNewClass.code.split('_').pop();
			if($scope.dataNewClass.from_date && $scope.dataNewClass.to_date){
				let fromDate = new Date($scope.dataNewClass.from_date);
				let toDate = new Date($scope.dataNewClass.to_date);
				if(fromDate.getTime() >= toDate.getTime()){
					toastr.error("Thời gian bắt đầu lớp học phải nhỏ hơn thời gian kết thúc lớp học!");
          			return;
				}
			}
			ApiService.POST('classes', $scope.dataNewClass).then(res=> {
				$scope.getClass();
				swal.fire({title:"Thêm lớp thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#classModal').modal('hide');
					}
				})
			})
		}

		$scope.submitForm = () => {
			if ($scope.formMode == 'create') {
				$scope.addClass();
			} else {
				$scope.editClass();
			}
		}
		$scope.openModalAddClass = () => {

			$scope.formMode ='create';
			$scope.dataNewClass = {
				field_id:null,
				teachers: [],
			};
			$('#classModal').modal('show');
		}
		$scope.updateModal = (idx) => {
			$scope.formMode = 'update';
			$scope.dataNewClass = {}
			ApiService.GET("classes/" + $scope.dataClass[idx].id).then(res => {
				$scope.dataNewClass = res;
				$scope.dataNewClass.code = $scope.dataNewClass.name;
				if(!$scope.dataNewClass.field_id && $scope.dataNewClass.field_id != 0) {
					$scope.dataNewClass.field_id = '';
				} else {
					$scope.dataNewClass.field_id = $scope.dataNewClass.field_id.toString();
				}
				if($scope.dataNewClass.teachers && $scope.dataNewClass.teachers.length > 0) {
					$scope.dataNewClass.teachers = $scope.dataNewClass.teachers.map(item => {
						return item.toString();
					});
				}
				$scope.$apply();
				$('#classModal').modal('show');
			})
		}

		$scope.editClass = () => {
			
			if($scope.dataNewClass.from_date && $scope.dataNewClass.to_date){
				let fromDate = new Date($scope.dataNewClass.from_date);
				let toDate = new Date($scope.dataNewClass.to_date);
				if(fromDate.getTime() >= toDate.getTime()){
					toastr.error("Thời gian bắt đầu lớp học phải nhỏ hơn thời gian kết thúc lớp học!");
          			return;
				}
			}
			$scope.dataNewClass.code = $scope.dataNewClass.code.split('_');
			$scope.dataNewClass.code.shift();
			$scope.dataNewClass.code = $scope.dataNewClass.code.join('_');
			
			console.log($scope.dataNewClass);
			ApiService.PUT('classes', $scope.dataNewClass).then(res=> {
				$scope.getClass();
				swal.fire({title:"Sửa lớp thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#classModal').modal('hide');
					}
				})
			})
		}

		$scope.quickUpdateClass = (idx) => {

			$scope.dataNewClass = $scope.dataClass[idx];
			$scope.dataNewClass.batch_id = $scope.dataBatches.id;
			if(!$scope.dataNewClass.from_date || !$scope.dataNewClass.to_date || $scope.dataNewClass.from_date == "NaN-NaN-NaN" || $scope.dataNewClass.to_date == "NaN-NaN-NaN") {
				toastr.error("Bạn chưa nhập thời gian cho lớp học!");
          		return;
			}
			if($scope.dataNewClass.from_date && $scope.dataNewClass.to_date){
				let fromDate = new Date($scope.dataNewClass.from_date);
				let toDate = new Date($scope.dataNewClass.to_date);
				if(fromDate.getTime() >= toDate.getTime()){
					toastr.error("Thời gian bắt đầu lớp học phải nhỏ hơn thời gian kết thúc lớp học!");
          			return;
				}
			}
			ApiService.PUT('classes', $scope.dataNewClass).then(res=> {
				$scope.getClass();
				swal.fire({title:"Cập nhật lớp thành công",type:"success"}).then(function(result){
					if(result.value){
						
					}
				})
			})
		}
		$scope.changeNganh= () => {
			if($scope.dataNewClass.field_id) {
				let name;
				$scope.dataStudyField.map(item => {
					if(item.id == $scope.dataNewClass.field_id ) {
						name = item.code
					}
				})
				$scope.dataNewClass.code =  $scope.centerCode + '_' + name;
			}
		}
		$scope.dataTeacher;
		$scope.getTeacher = () => {
			return ApiService.GET('users/listTeacher').then(res => {
				$scope.dataTeacher = res;
				$scope.$apply();
			})
		}
		$scope.getTeacher();
		$scope.deleteClass = (idx) => {
			let id = $scope.dataClass[idx].id;
			$('[data-toggle="m-tooltip"]').tooltip('hide');
            swal.fire({
							title:"Bạn chắc chắn muốn xóa lớp này?",
							confirmButtonText:  'Xóa', 
							cancelButtonText:  'Hủy', 
							showCancelButton: true,
							cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
							type: "warning"
						}).then(res => {
                if(res.value) {
                    ApiService.DELETE('classes/'+id).then(res => {
                      $scope.getClass();
					  toastr.success("Xóa thành công");
                    });
                };
            });
		}
	});
})();

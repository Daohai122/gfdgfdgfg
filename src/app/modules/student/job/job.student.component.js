(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Job.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile, OptionService) {
		$scope.studentJob;
		$scope.formMode = 'create';
		$scope.jobFormData = {};
		$scope.selectedState = false;
		$scope.contactData = [];

		$scope.getStudentJob = () => {
			ApiService.GET('studentJob?student_id=' + $scope.studentId).then(res=> {
				$scope.studentJob = res.data;
				$scope.$apply();
			})
		}

		$scope.$watch("studentId", function(change) {
			$scope.getStudentJob();
		}, true)

		$scope.gotoEdit = function (idx) {
			$scope.formMode = 'update';
			Object.keys($scope.studentJob[idx]).map(function(key, index) {
				if (typeof($scope.studentJob[idx][key]) == 'number' || typeof($scope.studentJob[idx][key]) == 'boolean') {
					$scope.studentJob[idx][key] = $scope.studentJob[idx][key].toString();
				}
			});
			$scope.jobFormData = $scope.studentJob[idx];
			if ($scope.jobFormData.status_work != 5) {
				$scope.contactData = [];
				$('#jobFormModal').modal('show');
			} else {
				$scope.contactData = [];
				$scope.getCompanyContact();
				$scope.getCompanyName();
				$('select').next().selectpicker('refresh');
				$('#jobFormModal').modal('show');
			}
		}

		$scope.getCompanyName = () => {
			ApiService.GET("company/" + $scope.jobFormData.company_id).then(res => {
				$scope.companyInfoName = res.name;
				$scope.selectedState = true;
				$scope.$apply();
			});
		}

		$('#jobFormModal').on('hidden.bs.modal', function () {
			$scope.jobFormData = {
				contract_type: 0
			};
			$scope.jobStatus = undefined;
			$scope.company_name = undefined;
			$scope.companyInfoName = undefined;
			$scope.jobFormData= '';
			$scope.dataCompany = [];
			$scope.selectedState = true;
			$scope.contactData = [];
			
			$scope.formMode = 'create';
			
			$('select').selectpicker("refresh");

			_.defer(function(){ 
	            $scope.$apply();
	        });
		})

		$scope.deleteJob = function (idx) {
			var id = $scope.studentJob[idx].id;
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
					ApiService.DELETE("studentJob/" + id).then(res => {
						$scope.getStudentJob();
					}).catch(error => {
						// swal.fire({title:error.data.result.message, type:"error"});
					});
				}
			})
		}

		$scope.submitForm = () => {
			if ($scope.formMode == 'create') {
				$scope.addJob();
			} else {
				$scope.editJob();
			}
		}

		$scope.getCompany = () => {
			ApiService.GET('company?SearchString=' + $scope.company_name).then(res=> {
				$scope.dataCompany = res.data;
				$scope.$apply();
				$('#company_search').addClass('show');

				const ps = new PerfectScrollbar('#company_search', {
					wheelSpeed: 1,
					wheelPropagation: true,
					minScrollbarLength: 30
				});
			})
		}

		$('#company_input').click(function(event) {
			event.stopPropagation();
			if ($scope.dataCompany.length && $scope.dataCompany.length > 0) {
				$('#company_search').addClass('show');
			}
		})

		$(document).click(function (event) {
			if ($(event.target).closest('#company_search').length == 0) {
				$('#company_search').removeClass('show');
			}
		});

		$scope.selectCompany = (id, name) => {
			$('#company_search').removeClass('show');
			$scope.dataCompany = [];
			$scope.jobFormData.company_id = id;
			$scope.company_name = "";
			$scope.companyInfoName = name;
			$scope.selectedState = true;
			$scope.getCompanyContact();
		}

		$scope.getCompanyContact = () => {
			ApiService.GET("company/" + $scope.jobFormData.company_id).then(res => {
				if (!res.contacts || res.contacts.length == 0) {
					$scope.jobFormData.company_contact = res.name + ' - ' + res.contact_name + ' ' + res.contact_phone;
					$scope.$apply();
				} else {
					res.contacts.map(function(el) {
						$scope.contactData.push(el);
					})
					$scope.$apply();
				}
			});
		}

		$scope.$watch("jobFormData.company_contact_id", function(change) {
			if (change != undefined) {
				var companyContact = $scope.contactData.filter(x => x.id == change)[0];
				$scope.jobFormData.company_contact = companyContact.company_name + ' - ' + companyContact.contact_name + ' ' + companyContact.phone;
			}
		}, true)

		$scope.$watch("company_name", function(change) {
			if (change != undefined) {
				if ($scope.selectedState == false) {
					$('#company_search').addClass('show');
					$scope.getCompany();
				}
			}
			$scope.selectedState = false;
		}, true)

		$scope.getTeacher = () => {
			ApiService.GET('users/listTeacher').then(res=> {
				$scope.dataTeacher = res;
				$scope.$apply();
			})
		}
		
		$scope.getTeacher();

		$scope.$watch("centerCode", function(change) {
			if (change != undefined) {
				$scope.studentCodeGroup = [];
				$scope.studentCodeGroup[0] = change;
				$scope.getBatch();
			}
		}, true)

		$rootScope.$watch("studendInfo.center_code", function(change) {
			if (change != undefined) {
				$scope.getBatch();
			}
		}, true)

		$scope.$watch("jobFormData.advanced_batch_id", function(change) {
			if (change != undefined) {
				$scope.getClass();
			}
		}, true)

		$scope.getClass = () => {
			OptionService.getClass({batchIds: $scope.jobFormData.advanced_batch_id}).then(res => {
				$scope.dataClass = res;
				$scope.$apply();
			});
		}

		$scope.getBatch = () => {
			OptionService.getBatch({center_codes: $rootScope.studentInfo.center_code}).then(res => {
				$scope.dataBatches = res;
				$scope.$apply();
			});
		}

		$rootScope.$watch('studentInfo.id', function(change) {
			if (change != undefined) {
				$scope.getBatch()
			}
		})

		$scope.jobStatusList = [
			{ id: 0, value: "Đi bộ đội"},
			{ id: 1, value: "Học nâng cao"},
			{ id: 2, value: "Không đi làm"},
			{ id: 3, value: "Không liên lạc được"},
			{ id: 4, value: "Tự kinh doanh"},
			{ id: 5, value: "Đi làm"},
		]

		$scope.addJob = () => {
			$scope.jobFormData.student_id = $scope.studentId;
			$scope.jobFormData.job_name = $scope.jobStatusList.filter(x => x.id == $scope.jobFormData.status_work)[0].value;
			ApiService.POST('studentJob', $scope.jobFormData).then(res=> {
				$scope.getStudentJob();
				swal.fire({title:"Thêm công việc thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#jobFormModal').modal('hide');
					}
				})
			})
		}

		$scope.editJob = () => {
			// $scope.jobFormData.status_work = $scope.jobStatusList.filter(x => x.id == $scope.jobStatus)[0].value;
			ApiService.PUT('studentJob/' + $scope.jobFormData.id, $scope.jobFormData).then(res=> {
				$scope.getStudentJob();
				swal.fire({title:"Sửa công việc thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#jobFormModal').modal('hide');
					}
				})
			})
		}
	});
})();

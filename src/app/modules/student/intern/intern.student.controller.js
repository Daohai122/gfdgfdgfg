(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Intern.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile) {
		$scope.studentInternship = [];
		$scope.formMode = 'create';
		$scope.internshipFormData = {
			company_id: 0,
		};
		$scope.selectedState = false;
		
		$scope.getStudentInternship = () => {
			ApiService.GET('studentIntership?student_id=' + $scope.studentId).then(res=> {
				$scope.studentInternship = res.data;
				$scope.$apply();
			})
		}

		$scope.$watch("studentId", function(change) {
			$scope.getStudentInternship();
		}, true)

		$scope.gotoEdit = function (id) {
			$sope.internshipFormData = $scope.studentIntership.find(x => x.id == id);
			$('#internshipFormModal').modal('show');
		}

		$('#internshipFormModal').on('hidden.bs.modal', function () {
			$scope.internshipFormData = {};
			$scope.internshipSurvey = {};
			$scope.internshipSurvey['2.3'] = {
				reason: 0
			};
			$scope.internshipSurvey['2.4'] = {
				reason: 0
			};
			$scope.company_name = undefined;
			$scope.companyInfoName = undefined;
			$scope.dataCompany = [];
			$scope.selectedState = true;
			$scope.formMode = 'create';
			$('select').next().selectpicker('refresh');
		})

		$scope.deleteInternship = function (idx) {
			var id = $scope.studentInternship[idx].id;
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
					ApiService.DELETE("studentIntership/" + id).then(res => {
						$scope.getStudentInternship();
					});
				}
			})
		}

		$scope.updateInternship = (idx) => {
			$scope.formMode = 'update';
			$scope.internshipFormData = $scope.studentInternship[idx];
			$scope.getCompanyName();
			$scope.internshipSurvey = JSON.parse($scope.internshipFormData.form_survey);
			$('#internshipFormModal').modal('show');
		}

		$scope.getCompanyName = () => {
			ApiService.GET("company/" + $scope.internshipFormData.company_id).then(res => {
				$scope.companyInfoName = res.name;
				$scope.selectedState = true;
				$scope.$apply();
			});
		}

		$scope.submitForm = () => {
			if ($scope.formMode == 'create') {
				$scope.addInternship();
			} else {
				$scope.editInternship();
			}
		}

		$scope.getCompany = () => {
			ApiService.GET('company?SearchString=' + $scope.company_name).then(res=> {
				$scope.dataCompany = res.data;
				$scope.$apply();
				$('.custom-dropdown-search').addClass('show');

				const ps = new PerfectScrollbar('.custom-dropdown-search', {
					wheelSpeed: 1,
					wheelPropagation: true,
					minScrollbarLength: 30
				});
			})
		}

		$('#company_input').click(function(event) {
			event.stopPropagation();
			if ($scope.dataCompany && $scope.dataCompany.length > 0) {
				$('.custom-dropdown-search').addClass('show');
			}
		})

		$(document).click(function (event) {
			if ($(event.target).closest('.custom-dropdown-search').length == 0) {
				$('.custom-dropdown-search').removeClass('show');
			}
		});

		$scope.selectCompany = (id, name) => {
			$('.custom-dropdown-search').removeClass('show');
			$scope.internshipFormData.company_id = id;
			$scope.company_name = "";
			$scope.companyInfoName = name;
			$scope.selectedState = true;
		}

		$scope.$watch("company_name", function(change) {
			if (change != undefined) {
				if ($scope.selectedState == false) {
					$scope.getCompany();
				}
			}
			$scope.selectedState = false;
		}, true)

		$scope.addInternship = () => {
			$scope.internshipFormData.student_id = $scope.studentId;
			$scope.internshipFormData.form_survey = JSON.stringify($scope.internshipSurvey);
			ApiService.POST('studentIntership', $scope.internshipFormData).then(res=> {
				$scope.getStudentInternship();
				swal.fire({title:"Thêm thực tập thành công",type:"success"}).then(function(result){
					$scope.internshipFormData = {};
					if(result.value){
						$('#internshipFormModal').modal('hide');
					}
				})
			})
		}

		$scope.editInternship = () => {
			$scope.internshipFormData.student_id = $scope.studentId;
			$scope.internshipFormData.form_survey = JSON.stringify($scope.internshipSurvey);
			ApiService.PUT('studentIntership/' + $scope.internshipFormData.id, $scope.internshipFormData).then(res=> {
				$scope.getStudentInternship();
				$scope.internshipFormData = {};
				swal.fire({title:"Sửa thực tập thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#internshipFormModal').modal('hide');
					}
				})
			})
		}
	});
})();

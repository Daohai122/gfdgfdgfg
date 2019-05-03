(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Detail.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile, $location) {
		$scope.dataStudent;
		$scope.studentId;
		$rootScope.studentInfo;


		if (!$location.$$search.mode) {
			$scope.mode = 'view';
			$location.search('mode', $scope.mode);
		} else {
			$scope.mode = $location.$$search.mode;
		}

		$scope.changeMode = (mode) => {
			$scope.mode = mode;
			$location.search('mode', mode);
		}

		$scope.goToInternAdd = function () {
			$('#internshipFormModal').modal('show');
		}

		$scope.goToJobAdd = function () {
			$('select').selectpicker("refresh");
			$('#jobFormModal').modal('show');
		}

		$scope.goToAdd = function () {
			$state.go('admin.student.add');
		}

		$scope.$watch("studentId", function(change) {
			if (change != undefined) {
				$scope.getStudentInfo();
			}
		}, true)

		$scope.getStudentInfo = () => {
			ApiService.GET("students/" + $scope.studentId).then(res => {
				Object.keys(res).map(function(key, index) {
					if (typeof(res[key]) == 'number' || typeof(res[key]) == 'boolean') {
						res[key] = res[key].toString();
					}
				});
				$rootScope.studentInfo = res;
				if ($rootScope.studentInfo.profileImageUrl == null || $rootScope.studentInfo.profileImageUrl == "") {
					$rootScope.studentInfo.avatar = '/assets/images/default_user.jpg';
				} else {
					$rootScope.studentInfo.avatar = GLOBAL_CONFIG.UPLOAD + $rootScope.studentInfo.profileImageUrl;
				}
				$rootScope.studentInfo.dateOfBirth = moment($rootScope.studentInfo.birthday).format("DD/MM/YYYY");

				$scope.getStudentByClass();
			})
		}

		$scope.deleteStudent = function () {
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
					ApiService.DELETE("students/" + $rootScope.studentInfo.id).then(res => {
						$scope.studentId = null;
						$state.go('admin.student.list');
						Swal.fire({
							title: "Xóa thành công",
							type: 'success'
						});
					});
				}
			})
		}
		
		const ps = new PerfectScrollbar('.m-list__body', {
			wheelSpeed: 1,
			wheelPropagation: true,
			minScrollbarLength: 30
		});
		$scope.getStudentByClass = function () {
			let classList = {lstClassId: $rootScope.studentInfo.class_id}
			ApiService.GET("/students/getListStudentByClass", classList).then(res => {
				$scope.dataStudent = res;
				$scope.$apply();
			});
		}
		$scope.studentGetDetail = (id) => {
			$state.params.id = id;
			$state.go('admin.student.detail.info', {id: id}, {notify: false});
		}

		$scope.$watchCollection(function(){
		    return $state.params;
		}, function(change){
			if (change.mode != $scope.mode) {
				$scope.mode = change.mode;
			}
			$scope.studentId = $state.params.id;
			_.defer(function(){ 
	            $scope.$apply(); 
	        });
		});
	});
})();

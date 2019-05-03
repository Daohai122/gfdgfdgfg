(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Survey.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile) {
		$scope.surveyFormId;
		$scope.surveyData;
		$scope.version = 2;

		$scope.openSurvey = (surveyId, mode) => {
			$scope.surveyFormId = surveyId;
			$scope.studentSurvey = {};
			$scope.version = 2;
			$scope.studentSurvey.version = 2;
			if (mode == 'update') {
				$scope.studentSurvey = JSON.parse($scope.surveyData["survey" + surveyId + "_data"]);
				if ($scope.studentSurvey.version != 2) {
					$scope.version = 1;
					$scope.studentSurvey.version = 1;
				}
				if ($scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat) {
					var tempSurveyValue = $scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat.split(',');
					tempSurveyValue.map(function(el, idx) {
						$scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat = {};
						$scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat[Number(el)] = true;
					})
				}
			}
			$('#survey').modal('show');
		}

		$scope.submitForm = () => {
			if ($scope.surveyData.id == 0) {
				$scope.addSurvey();
			} else {
				$scope.editSurvey();
			}
		}

		$scope.addSurvey = () => {
			let surveyData;
			if ($scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat) {
				var tempSurveyValue = [];
				Object.keys($scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat).map(function(key, index) {
					tempSurveyValue.push(key);
				});
				$scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat = tempSurveyValue.join();
			}
			surveyData = JSON.stringify($scope.studentSurvey);
			let data = {
				student_id: $scope.studentId,
				survey1_data: surveyData,
			}
			ApiService.POST('studentsurveys', data).then(res=> {
				swal.fire({title:"Thêm khảo sát thành công",type:"success"}).then(function(result){
					$scope.getStudentSurvey();
					if(result.value){
						$('#survey').modal('hide');
					}
				})
			})
		}

		$scope.editSurvey = () => {
			let surveyData1, surveyData2, surveyData3;
			if ($scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat) {
				var tempSurveyValue = [];
				Object.keys($scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat).map(function(key, index) {
					tempSurveyValue.push(key);
				});
				$scope.studentSurvey.cau_nao_duoi_day_ban_thay_dung_voi_minh_nhat = tempSurveyValue.join();
			}
			switch ($scope.surveyFormId) {
				case 1:
					surveyData1 = JSON.stringify($scope.studentSurvey);
					surveyData2 = $scope.surveyData.survey2_data;
					surveyData3 = $scope.surveyData.survey3_data;
					break;
				case 2:
					surveyData2 = JSON.stringify($scope.studentSurvey);
					surveyData1 = $scope.surveyData.survey1_data;
					surveyData3 = $scope.surveyData.survey3_data;
					break;
				default:
					surveyData3 = JSON.stringify($scope.studentSurvey);
					surveyData1 = $scope.surveyData.survey1_data;
					surveyData2 = $scope.surveyData.survey2_data;
					break;
			}
			let data = {
				id: $scope.surveyData.id,
				student_id: $scope.studentId,
				survey1_data: surveyData1,
				survey2_data: surveyData2,
				survey3_data: surveyData3
			}
			ApiService.PUT('studentsurveys', data).then(res=> {
				swal.fire({title:"Sửa khảo sát thành công",type:"success"}).then(function(result){
					$scope.getStudentSurvey();
					if(result.value){
						$('#survey').modal('hide');
					}
				})
			})
		}

		$scope.getStudentSurvey = () => {
			ApiService.GET("studentsurveys/" + $scope.studentId).then(res => {
				$scope.surveyData = res;
				$scope.$apply();
			});
		}

		$scope.$watch("studentId", function(change) {
			$scope.getStudentSurvey();
		}, true)
	});
})();

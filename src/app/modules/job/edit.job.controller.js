(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Edit.Job.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService, $compile, $location) {
		$scope.$on("$viewContentLoaded", function () {
			$scope.getJobData();
	    });

	    $scope.dataJob = {};
		$scope.selectedState = false;

		$scope.goToList = () => {
			$state.go('admin.job.list');
		}

		$scope.getJobData = () => {
			ApiService.GET("jobs/" + $stateParams.id).then(res => {
				$scope.dataJob = res;
				$scope.selectedState = true;
				$scope.$apply();
			});
		}

		$scope.updateJobs = () => {
			ApiService.PUT("jobs", $scope.dataJob).then(res => {
				Swal.fire({title: 'Sửa thành công!',type: 'success'}).then(function(result){
					if(result.value){
						$state.go('admin.job.list');
					}
				})
			});
		}

		// $("#m_datetimepicker_1").datepicker({
		// 	todayHighlight: !0,
		// 	autoclose: !0,
		// 	format: "dd/mm/yyyy",
		// 	orientation: "bottom",
		// }).on("change", function(date) {
		// 	$scope.dataJob.fromDate = $("#m_datetimepicker_1").val()
		// });

		// $("#m_datetimepicker_2").datepicker({
		// 	todayHighlight: !0,
		// 	autoclose: !0,
		// 	format: "dd/mm/yyyy",
		// 	orientation: "bottom",
		// }).on("change", function(date) {
		// 	$scope.dataJob.toDate = $("#m_datetimepicker_2").val()
		// });

		$scope.getCompany = () => {
			ApiService.GET('company?SearchString=' + $scope.dataJob.company).then(res=> {
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
			$scope.dataJob.companyId = id;
			$scope.dataJob.company = name;
			$scope.dataJob.address = $scope.dataCompany.filter(x => x.id == id)[0].address;
			$scope.selectedState = true;
		}

		$scope.$watch("dataJob.company", function(change) {
			if (change != undefined) {
				if ($scope.selectedState == false) {
					$scope.getCompany();
				}
			}
			$scope.selectedState = false;
		}, true)

	});
})();

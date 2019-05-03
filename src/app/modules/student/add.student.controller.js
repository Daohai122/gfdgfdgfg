(function() {
	"use strict";
	angular
	.module("MyApp")
	.controller("Add.Student.Controller", function($rootScope,$state,$scope,ApiService, OptionService) {
		$scope.dataStudent={
			profileImageUrl: '',
			phones: ['']
		}
		$scope.centerCode;
		$scope.studentCode = '';
		$scope.studentCodeGroup = [];
		$scope.addPhone = () => {
	      $scope.dataStudent.phones.push('');
	     };
	     $scope.deletePhone = (id) => {
	      $scope.dataStudent.phones.splice(id,1);
	     };
		let auth = localStorage.getItem("auth");
		auth = JSON.parse(auth);

		$("#m-dropzone").dropzone({
			url: GLOBAL_CONFIG.API_URL+ "files/UploadFile",
			paramName: "file",
			maxFiles:1,
			acceptedFiles: ".png,.jpg",
			addRemoveLinks: true,
			headers: {
				'Authorization': 'Bearer ' + auth.accessToken
			},
			success: function(file,result){
				$scope.dataStudent.profileImageUrl = result.result.url
			},
			init: function () {
				this.on("addedfile", function(file) {
				  if (this.files.length > 1)
				  this.removeFile(this.files[0]);
				  // $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
				  // $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
				  $scope.dataStudent.profileImageUrl='';
				});
				this.on("removedfile", function(file) {
					$scope.dataStudent.profileImageUrl='';
				});
  
			  }
		});
		$("#m-dropzone_profile").dropzone({
			url: GLOBAL_CONFIG.API_URL+ "files/UploadFile",
			paramName: "file",
            acceptedFiles: ".png,.jpg",
            addRemoveLinks: true,
            clickable: "#upload_img",
            dictDefaultMessage:"",
            maxFiles:1,
            headers: {
                'Authorization': 'Bearer ' + auth.accessToken
            },
			success: function(file,result){
				$scope.dataStudent.profile_url = result.result.url
			},
			init: function () {
				this.on("addedfile", function(file) {
				  if (this.files.length > 1)
				  this.removeFile(this.files[0]);
				  $scope.dataStudent.profile_url='';
				});
				this.on("removedfile", function(file) {
					$scope.dataStudent.profile_url='';
				});
  
			  }
		});
		

		$scope.getStudentCode = () => {
			ApiService.GET('students/IdMax').then(res => {
				$scope.studentCodeMax = res;
				$scope.studentCode = $scope.studentCodeMax;
			});
		}
		$scope.getStudentCode();

		$scope.$watch("studentCodeGroup", function(change) {
			if (change != undefined) {
				if ($scope.studentCodeGroup.length > 0 || $scope.studentCodeMax) {
					$scope.studentCode = $scope.studentCodeGroup.join('_') + '_' + $scope.studentCodeMax;
					$scope.dataStudent.code = $scope.studentCode;
				}
			}
		}, true)

		$scope.$watch("centerCode", function(change) {
			if (change != undefined) {
				$scope.studentCodeGroup = [];
				$scope.studentCodeGroup[0] = change;
				$scope.getBatch();
			}
		}, true)

		$scope.$watch("dataStudent.batch_id", function(change) {
			if (change != undefined) {
				var batchCode = $scope.dataBatches.find(x => x.id == $scope.dataStudent.batch_id).name;
				$scope.studentCodeGroup[0] = batchCode;
				$scope.getClass();
			}
		}, true)

		$scope.$watch("dataStudent.class_id", function(change) {
			if (change != undefined) {
				var className = $scope.dataClass.find(x => x.id == $scope.dataStudent.class_id).name.split('_');
				className.splice(0, 1);
				$scope.studentCodeGroup[1] = className.join('_');
			}
		}, true)

		// $scope.$watch("dataStudent.province_code", function(change) {
		// 	if (change != undefined) {
		// 		$scope.getDistrict();
		// 	}
		// }, true)

		// $scope.$watch("dataStudent.temp_province_code", function(change) {
		// 	if (change != undefined) {
		// 		$scope.getTempDistrict();
		// 	}
		// }, true)

		$scope.getClass = () => {
			OptionService.getClass({batchIds: $scope.dataStudent.batch_id}).then(res => {
				$scope.dataClass = res;
				$scope.$apply();
			});
		}
		$scope.getProvince = () => {
			ApiService.GET('address/provinces').then(res => {
				$scope.dataProvince = res;
				$scope.$apply();
			});
		}
		// $scope.getDistrict = () => {
		// 	ApiService.GET('address/districts?province_code=' + $scope.dataStudent.province_code).then(res => {
		// 		$scope.dataDistrict = res;
		// 		$scope.$apply();
		// 	});
		// }
		// $scope.getTempDistrict = () => {
		// 	ApiService.GET('address/districts?province_code=' + $scope.dataStudent.temp_province_code).then(res => {
		// 		$scope.dataTempDistrict = res;
		// 		$scope.$apply();
		// 	});
		// }
		$scope.getBatch = () => {
			OptionService.getBatch({center_codes: $scope.centerCode}).then(res => {
				$scope.dataBatches = res;
				$scope.$apply();
			});
		}
		$scope.getCenter = () => {
			OptionService.getCenter().then(res => {
				$scope.dataCenter = res;
				$scope.$apply();
			});
		}
		$scope.getProvince();
		$scope.getCenter();
		$scope.addStudent = function () {
			ApiService.POST('students', $scope.dataStudent).then(res => {
				Swal.fire({title: 'Thêm thành công!',type: 'success'}).then(function(result){
			        if(result.value){
			            $state.go('admin.student.list');
			        }
			    })
			})
		}
		$scope.goToList = () => {
			$state.go('admin.student.list');
		}
	});
})();

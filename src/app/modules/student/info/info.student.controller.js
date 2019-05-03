(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Info.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile, OptionService, $location) {
		if (!$location.$$search.mode) {
			$scope.mode = 'view';
			$location.search('mode', $scope.mode);
		} else {
			$scope.mode = $location.$$search.mode;
		}
		$scope.studentInfoForm = {
			profileImageUrl:''
		}
		$scope.addPhone = () => {
			$scope.studentInfoForm.phones.push('');
		};
		$scope.deletePhone = (id) => {
			$scope.studentInfoForm.phones.splice(id,1);
		};

		$scope.changeMode = (mode) => {
			$scope.mode = mode;
			$location.search('mode', mode);
		}

		let auth = localStorage.getItem("auth");
		auth = JSON.parse(auth);

		$("#m-dropzone").dropzone({
			url: GLOBAL_CONFIG.API_URL + "/files/UploadFile",
			paramName: "file",
			maxFiles: 1,
			acceptedFiles: ".png,.jpg",
			addRemoveLinks: true,
			headers: {
				'Authorization': 'Bearer ' + auth.accessToken
			},

			success: function(file, result) {
				$scope.studentInfoForm.profileImageUrl = result.result.url;
			},
			init: function() {
				let self = this;
				$scope.$watch('studentInfoForm', function(change) {
					$('#m-dropzone .dz-preview').remove();
					if ($scope.studentInfoForm.profileImageUrl != null && $scope.studentInfoForm.profileImageUrl != '') {
						var mockFile = {
							name: "img.jpg",
							size: 12345,
							type: "image/jpeg"
						};
						self.options.addedfile.call(self, mockFile);
						self.options.thumbnail.call(
							self,
							mockFile,
							GLOBAL_CONFIG.UPLOAD+$scope.studentInfoForm.profileImageUrl
							);
						mockFile.previewElement.classList.add("dz-success");
						mockFile.previewElement.classList.add("dz-complete");
					} else {
						$('#m-dropzone .dropzone').removeClass('dz-started');
					}
				})
				this.on("addedfile", function(file) {
					if (this.files.length > 1)
						this.removeFile(this.files[0]);
					// $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
					// $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
					$scope.studentInfoForm.profileImageUrl='';
				});
				this.on("removedfile", function(file) {
					$scope.studentInfoForm.profileImageUrl='';
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
				$scope.studentInfoForm.profile_url = result.result.url;
			},
			init: function () {
				let self = this;
				$scope.$watch('studentInfoForm', function(change) {
					$('#m-dropzone_profile .dz-preview').remove();
					if ($scope.studentInfoForm.profile_url != null && $scope.studentInfoForm.profile_url != '') {
						var mockFile = {
							name: "img.jpg",
							size: 12345,
							type: "image/jpeg"
						};
						self.options.addedfile.call(self, mockFile);
						self.options.thumbnail.call(
							self,
							mockFile,
							GLOBAL_CONFIG.UPLOAD+$scope.studentInfoForm.profile_url
							);
						mockFile.previewElement.classList.add("dz-success");
						mockFile.previewElement.classList.add("dz-complete");
					} else {
						$('#m-dropzone_profile .dropzone').removeClass('dz-started');
					}
				})
				this.on("addedfile", function(file) {
				  if (this.files.length > 1)
				  this.removeFile(this.files[0]);
				  $scope.studentInfoForm.profile_url='';
				});
				this.on("removedfile", function(file) {
					$scope.studentInfoForm.profile_url='';
				});
  
			  }
		});

		$rootScope.$watch('studentInfo.id', function(change) {
			if (change != undefined) {
				$scope.studentInfoForm = {
					company_scale: 0,
					work_type: 0,
					work_time: 0,
					profileImageUrl: ''
				}
				$scope.studentInfoForm = $rootScope.studentInfo;
				$scope.getCenterName();
				$scope.getCenter();
				$scope.getProvince();
			}
		})

		$scope.getCenterName = () => {
			ApiService.GET('centers/' + $rootScope.studentInfo.center_code).then(res => {
				$scope.centerName = res.name;
				$scope.$apply();
			});
		}

		$scope.$watchCollection(function(){
		    return $state.params;
		}, function(change){
			if (change.mode != $scope.mode) {
				$scope.mode = change.mode;
			}
			_.defer(function(){ 
	            $scope.$apply(); 
	        });
		});

		$scope.$watch("studentInfoForm.center_code", function(change) {
			if (change != undefined) {
				$scope.getBatch();
			}
		}, true)

		$scope.getCenter = () => {
			OptionService.getCenter().then(res => {
				$scope.dataCenter = res;
				$scope.$apply();
			});
		}

		$scope.$watch("studentInfoForm.batch_id", function(change) {
			if (change != undefined) {
				$scope.getClass();
			}
		}, true)

		$scope.getBatch = () => {
			OptionService.getBatch({center_codes: $scope.studentInfoForm.center_code}).then(res => {
				$scope.dataBatches = res;
				if (!$scope.batchName) {
					$scope.batchName = $scope.dataBatches.find(x => x.id == $rootScope.studentInfo.batch_id).name;
				}
				$scope.$apply();
			});
		}

		$scope.getClass = () => {
			OptionService.getClass({batchIds: $rootScope.studentInfo.batch_id}).then(res => {
				$scope.dataClass = res;
				if (!$scope.className) {
					$scope.className = $scope.dataClass.find(x => x.id == $rootScope.studentInfo.class_id).name;
				}
				$scope.$apply();
			});
		}

		// $scope.$watch("studentInfoForm.province_code", function(change) {
		// 	if (change != undefined) {
		// 		$scope.getDistrict();
		// 	}
		// }, true)

		// $scope.$watch("studentInfoForm.temp_province_code", function(change) {
		// 	if (change != undefined) {
		// 		$scope.getTempDistrict();
		// 	}
		// }, true)

		$scope.getProvince = () => {
			ApiService.GET('address/provinces').then(res => {
				$scope.dataProvince = res;
				if ($rootScope.studentInfo.province_code) {
					$scope.provinceName = $scope.dataProvince.find(x => x.code == $rootScope.studentInfo.province_code).name;
				}
				if ($rootScope.studentInfo.temp_province_code) {
					$scope.provinceTempName = $scope.dataProvince.find(x => x.code == $rootScope.studentInfo.temp_province_code).name;
				}
				$scope.$apply();
			});
		}

		// $scope.getDistrict = () => {
		// 	ApiService.GET('address/districts?province_code=' + $rootScope.studentInfo.province_code).then(res => {
		// 		$scope.dataDistrict = res;
		// 		$scope.$apply();
		// 	});
		// }

		// $scope.getTempDistrict = () => {
		// 	ApiService.GET('address/districts?province_code=' + $rootScope.studentInfo.temp_province_code).then(res => {
		// 		$scope.dataTempDistrict = res;
		// 		$scope.$apply();
		// 	});
		// }

		$scope.editStudent = () => {
			ApiService.PUT('students/' + $scope.studentInfoForm.id, $scope.studentInfoForm).then(res => {
				Swal.fire({title: 'Cập nhật thành công!',type: 'success'}).then(function(result){
					$scope.getStudentInfo();
			        $location.search('mode', 'view');
			    })
			})
		}

		$scope.downloadData = () => {
			var win = window.open(GLOBAL_CONFIG.UPLOAD + $scope.studentInfo.profile_url,"_blank");
			win.focus();
			win.onload = function() { window.open(GLOBAL_CONFIG.UPLOAD + $scope.studentInfo.profile_url,"_blank") };
		}
	});
})();

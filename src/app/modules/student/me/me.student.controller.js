(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Me.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile, $location) {
		$scope.studentME;
		if (!$location.$$search.mode) {
			$scope.mode = 'view';
			$location.search('mode', $scope.mode);
		} else {
			$scope.mode = $location.$$search.mode;
		}
		$scope.meFormData = {
			profile_family: ""
		};

		let auth = localStorage.getItem("auth");
		auth = JSON.parse(auth);

		$("#m-dropzone").dropzone({
			url: GLOBAL_CONFIG.API_URL+ "files/UploadFile",
			paramName: "file",
			maxFiles:1,
			clickable: "#upload_img",
			acceptedFiles: ".txt,.pdf,.doc,.docx,.jpg,.png,.jpeg,.gif",
			addRemoveLinks: true,
			dictDefaultMessage:"",
			headers: {
				'Authorization': 'Bearer ' + auth.accessToken
			},
			success: function(file,result){
				$scope.meFormData.profile_family = result.result.url;
			},
			init: function () {
				let self = this;
				$scope.$watch('meFormData', function(change) {
					$('.dz-preview').remove();
					if ($scope.meFormData.profile_family != null && $scope.meFormData.profile_family != '') {
						var mockFile = {
							name: "img.jpg",
							size: 12345,
							type: "image/jpeg"
						};
						self.options.addedfile.call(self, mockFile);
						self.options.thumbnail.call(
							self,
							mockFile,
							GLOBAL_CONFIG.UPLOAD+$scope.meFormData.profile_family
						);
						mockFile.previewElement.classList.add("dz-success");
						mockFile.previewElement.classList.add("dz-complete");
					} else {
						$('.dropzone').removeClass('dz-started');
					}
				})
				this.on("addedfile", function(file) {
				  if (this.files.length > 1)
				  this.removeFile(this.files[0]);
				  // $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
				  // $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
				  $scope.meFormData.profile_family='';
				});
				this.on("removedfile", function(file) {
					$scope.meFormData.profile_family='';
				});
  
			}
		});

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

		$rootScope.$watch('studentInfo.id', function(change) {
			if (change != undefined) {
				$scope.getStudyField();
				$scope.getME();
			}
		})

		$scope.changeMode = (mode) => {
			$scope.meMode = mode;
			$location.search('mode', mode);
		}

		$scope.getStudyField = () => {
			ApiService.GET("studyField?limit=100&centerCode=" + $rootScope.studentInfo.center_code).then(res => {
				$scope.studyField = res.data;
			})
		}

		$scope.getStudentStatus = () => {
			ApiService.GET("studentStatus?studentId=" + $scope.studentId).then(res => {
				$scope.studentStatus = res;
				$scope.$apply();
			})
		}

		$scope.getME = () => {
			$scope.studentME = {};
			$scope.meFormData = {
				result: 0,
				know_reach_via: 0,
				home_visited: 0,
				family_group: 0
			};
			ApiService.GET("studentME?student_id=" + $scope.studentId).then(res => {
				$scope.studentME = {};
				$scope.meFormData = {};
				if (res.data.length > 0) {
					Object.keys(res.data[0]).map(function(key, index) {
						if (typeof(res.data[0][key]) == 'number' || typeof(res.data[0][key]) == 'boolean') {
							res.data[0][key] = res.data[0][key].toString();
						}
					});
				}
				$scope.studentME = res.data[0];
				$scope.fieldStudy = []
				if ($scope.studentME) {
					$scope.meFormData = $scope.studentME;
					$scope.$apply();
					if ($scope.studentME.fields) {
						$scope.studentME.fields.map(function(el, idx) {
							$scope.fieldStudy.push($scope.studyField.find(x => x.id == el).name)
						})
					}
				}
				$scope.getStudentStatus();
				$('select').selectpicker('refresh');
				$scope.$apply();
			})
		}

		$scope.submitForm = () => {
			if (!$scope.studentME) {
				$scope.addME();
			} else {
				$scope.editME();
			}
		}

		$scope.addME = () => {
			$scope.meFormData.student_id = $scope.studentId;
			ApiService.POST('studentME', $scope.meFormData).then(res => {
				Swal.fire({title: 'Thêm thành công!',type: 'success'}).then(function(result){
			        $scope.getME();
			        $location.search('mode', 'view');
			    })
			})
		}

		$scope.editME = () => {
			ApiService.PUT("studentME/" + $scope.meFormData.id, $scope.meFormData).then(res => {
				Swal.fire({title: 'Sửa thành công!',type: 'success'}).then(function(result){
			        $scope.getME();
			        $location.search('mode', 'view');
			    })
			})
		}

		$scope.downloadData = () => {
			var win = window.open(GLOBAL_CONFIG.UPLOAD + $scope.studentME.profile_family,"_blank");
			win.focus();
			win.onload = function() { window.open(GLOBAL_CONFIG.UPLOAD + $scope.studentME.profile_family,"_blank") };
		}

		$scope.markStudentIsStudy = () => {
			ApiService.PUT("studentME/" + $scope.studentME.id + "/markAsIsStudy/true").then(res => {
				Swal.fire({title: 'Sửa thành công!',type: 'success'}).then(function(result){
			        $scope.getME();
			        $location.search('mode', 'view');
			    })
			})
		}

		$scope.addModalStatus = () => {
			$scope.formMode = 'create';
			$scope.formData = {};
			$scope.formData.month = $scope.studentStatus[$scope.studentStatus.length - 1].month != 12 ? $scope.studentStatus[$scope.studentStatus.length - 1].month + 1 : "";
			$('#statusFormModal').modal('show');
		}

		$scope.updateModalStatus = (idx) => {
			$scope.formMode = 'update';
			Object.keys($scope.studentStatus[idx]).map(function(key, index) {
				if (typeof($scope.studentStatus[idx][key]) == 'number' || typeof($scope.studentStatus[idx][key]) == 'boolean') {
					$scope.studentStatus[idx][key] = $scope.studentStatus[idx][key].toString();
				}
			});
			$scope.formData = $scope.studentStatus[idx];
			$('#statusFormModal').modal('show');
		}

		$scope.deleteStatus = (idx) => {
			var id = $scope.studentStatus[idx].id;
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
					ApiService.DELETE("studentStatus/" + id).then(res => {
						$scope.getStudentStatus();
					}).catch(error => {
						// swal.fire({title:error.data.result.message, type:"error"});
					});
				}
			})
		}

		$scope.submitModalForm = () => {
			if ($scope.formMode == 'create') {
				$scope.addStatus();
			} else {
				$scope.editStatus();
			}
		}

		$scope.addStatus = () => {
			$scope.formData.student_id = $scope.studentId;
			$scope.formData.student_me_id = $scope.studentME.id;
			ApiService.POST('studentStatus', $scope.formData).then(res=> {
				$scope.getStudentStatus();
				swal.fire({title:"Thêm trạng thái thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#statusFormModal').modal('hide');
					}
				})
			})
		}

		$scope.editStatus = () => {
			ApiService.PUT('studentStatus/' + $scope.formData.id, $scope.formData).then(res=> {
				$scope.getStudentStatus();
				swal.fire({title:"Sửa trạng thái thành công",type:"success"}).then(function(result){
					if(result.value){
						$('#statusFormModal').modal('hide');
					}
				})
			})
		}

		$('#statusFormModal').on('hidden.bs.modal', function () {
			$scope.formData = { };
			
			$scope.formMode = 'create';
			
			$('select').selectpicker("refresh");

			_.defer(function(){ 
	            $scope.$apply();
	        });
		})
	});
})();

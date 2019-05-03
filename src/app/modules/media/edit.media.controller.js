(function() {
	"use strict";
	angular
	.module("MyApp")
	.controller("Edit.Media.Controller", function($rootScope,$stateParams,$state,$scope,ApiService) {
		$scope.getMedia = function () {
			ApiService.GET("media/" + $stateParams.id).then(res => {
				$scope.dataMedia = res;
				$scope.dataMedia.partnerId = $scope.dataMedia.partnerId.toString();
				$scope.getPartnerName();
				$scope.selectedState = true;
				$scope.dataMedia.type = $scope.dataMedia.type.toString();
				let auth = localStorage.getItem("auth");
				auth = JSON.parse(auth);
				$("#m-dropzone").dropzone({
					url: GLOBAL_CONFIG.API_URL + "/files/UploadFile",
					paramName: "file",
		            addRemoveLinks: true,
		            clickable: "#upload_img",
		            dictDefaultMessage:"",
		            maxFiles:1,
					headers: {
						'Authorization': 'Bearer ' + auth.accessToken
					},
					success: function(file,result){
						$scope.dataMedia.fileUpload = result.result.url;
					},
					init: function () {
						if($scope.dataMedia.fileUpload){
							var mockFile = { name: "img.jpg", size: 12345, type: 'image/jpeg' };       
							this.options.addedfile.call(this, mockFile);
							this.options.thumbnail.call(this, mockFile,  GLOBAL_CONFIG.UPLOAD + $scope.dataMedia.fileUpload);
							mockFile.previewElement.classList.add('dz-success');
							mockFile.previewElement.classList.add('dz-complete');
						}
						this.on("addedfile", function(file) {
							if (this.files.length > 1)
							this.removeFile(this.files[0]);
							$(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
							$(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
							$scope.dataMedia.fileUpload='';
						  });
						  this.on("removedfile", function(file) {
							$scope.dataMedia.fileUpload='';
						  });
						
					}
				})
				$scope.$apply();
			});
		}
		$scope.getMedia();

		$scope.getPartnerName = () => {
			ApiService.GET("partners/" + $scope.dataMedia.partnerId).then(res => {
				$scope.partner_name = res.name;
				$scope.partnerInfoName = res.name;
				$scope.selectedState = true;
				$scope.$apply();
			});
		}
		
		$scope.dataMedia={
			fileUpload:''
		}
		$scope.dataPartner;
		let auth = localStorage.getItem("auth");
		auth = JSON.parse(auth);
		$scope.updateMedia = function (){
			let data = {
				id: $stateParams.id,
				name : $scope.dataMedia.name,
				type : $scope.dataMedia.type,
				linkUrl : $scope.dataMedia.linkUrl,
				fileUpload :$scope.dataMedia.fileUpload,
				partnerId :$scope.dataMedia.partnerId,
				content : $scope.dataMedia.content,
				publishedTime : $scope.dataMedia.publishedTime,
				partner: $scope.partner_name,
			}
			ApiService.PUT('media',data).then(res => {
				Swal.fire({title: 'Sửa thành công!',type: 'success'}).then(function(result){
			        if(result.value){
			            $state.go('admin.media.list');
			        }
			    })
			})
		}
		$scope.goToList = () => {
			$state.go('admin.media.list');
		}

		$scope.getPartner = () => {
			ApiService.GET('partners?SearchString=' + $scope.partner_name).then(res=> {
				$scope.dataPartner = res.data;
				$scope.$apply();
				$('.custom-dropdown-search').addClass('show');

				const ps = new PerfectScrollbar('.custom-dropdown-search', {
					wheelSpeed: 1,
					wheelPropagation: true,
					minScrollbarLength: 30
				});
			})
		}

		$('#partner_input').click(function(event) {
			event.stopPropagation();
			if ($scope.dataPartner && $scope.dataPartner.length > 0) {
				$('.custom-dropdown-search').addClass('show');
			}
		})

		$(document).click(function (event) {
			if ($(event.target).closest('.custom-dropdown-search').length == 0) {
				$('.custom-dropdown-search').removeClass('show');
			}
		});

		$scope.selectPartner = (id, name) => {
			$('.custom-dropdown-search').removeClass('show');
			$scope.dataMedia.partnerId = id;
			$scope.partnerInfoName = name;
			$scope.selectedState = true;
		}

		$scope.$watch("partner_name", function(change) {
			if (change != undefined) {
				if ($scope.selectedState == false) {
					$scope.getPartner();
				}
			}
			$scope.selectedState = false;
		}, true)
	});
})();

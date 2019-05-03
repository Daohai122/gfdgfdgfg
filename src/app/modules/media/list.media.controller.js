(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("List.Media.Controller", function ($rootScope, $state, $scope, ApiService, $compile,$location) {
		$scope.dataMedia;
		$scope.reloadTable=1;
		$scope.tableConfig = {
			requestUrl: "media",
			columns: [
			{
				data:null,
				title:"STT",
				class:"text-center",
				render: function (data, type, full, meta) {
					return Number(meta.settings._iDisplayStart) + meta.row + 1;
				},
			},
			{
				data: "name",
				orderable: true,

				title: "Tên",
			},
			{
				data: "type",
				orderable: true,
				title: "Loại",
				render: function(data, type, full, meta) {
					switch (data) {
		              case 1:
		                return "Sản phẩm online";
		                break;
		              case 2:
		                return "Sản phẩm offline";
		                break;
		              case 3:
		                return "Sản phẩm reach";
		                break;
		              case 4:
		                return "Chuyến thăm nhà tài trợ";
		                break;
		            } 
				},
				fnCreatedCell: function (celContent, sData) {
					$compile(celContent)($scope);
				}
			},
			{
				title: "Trạng thái",
				orderable: true,
				data: "isActive",
				render: (data, type, full, meta) => {
					switch (data) {
		              case false:
		                return "Chưa kích hoạt";
		                break;
		              case true:
		                return "Đã kích hoạt";
		                break;
		            }

				},
				fnCreatedCell: function (celContent, sData) {
					$compile(celContent)($scope);
				}
			},
			{
				title: "Ngày đăng",
				orderable: true,
				data: "publishedTime",
				type:   'date',
			},
			{
				data: "partner",
				orderable: true,
				title: "Đối tác",
			},
			{
				title: "Hiển thị",
				orderable: true,
				class: "text-center",
				data: null,
				render: (data, type, full, meta) => {
					return `<span class="m-switch m-switch--icon "><label>
					<input ng-model="dataMedia[${meta.row}].isEnabled" ng-click="updateEnabled('${data.id}')" type="checkbox"><span></span></label>
					</span>`;

				},
				fnCreatedCell: function (celContent, sData) {
					$compile(celContent)($scope);
				}
			},
			{
				data: null,
				orderable: false,
				title: "Hành Động",
				class: "text-center",
				render: function (data) {
					var buttonAction = ""
					buttonAction += '<a ui-sref="admin.media.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" data-skin="light" title="" data-original-title="Sửa"><i class="la la-edit"></i></a>';
					buttonAction += '<a href="javascript:;" ng-click="deleteMedia(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" data-skin="light" title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>';
					if (data.isActive == false) {
						buttonAction += '<a href="javarscipt:;" ng-click="updateActive(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Kích hoạt"><i class="la la-check-circle-o"></i></a>';
					}

					return buttonAction;
				},
				fnCreatedCell: function (celContent, sData) {
					$compile(celContent)($scope);
				}
			}
			],
			fnDrawCallback: function (oSettings) {
				$('[data-toggle="m-tooltip"]').tooltip({
            placement: "auto"
          });
			}
		};

		$scope.goToAdd = function () {
			$state.go('admin.media.add');
		}
		$scope.updateEnabled = function(id) {
			let data = $scope.dataMedia.find(x => x.id == id);
			if (data.isEnabled == true) {
				ApiService.PUT("media/" + id + "/enable").then(res => {
					swal.fire({title:"Cập nhật thành công", type: "success"});
				})
			} else {
				ApiService.PUT("media/" + id + "/disable").then(res => {
					swal.fire({title:"Cập nhật thành công", type: "success"});
				})
			}
		}
		$scope.updateActive = function(id) {
			Swal.fire({
				title: 'Bạn chắc chắn muốn kích hoạt truyền thông?',
				confirmButtonText: 'Đồng ý',
				cancelButtonText: 'Hủy',
				showCancelButton: true,
				cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
				type: 'warning',
			}).then(result => {
				if (result.value) {
					ApiService.PUT("media/" + id + "/active").then(res => {
						$scope.reloadTable ++;
						$scope.$apply();
						toastr.success("Kích hoạt thành công thành công");
					}).catch(error => {
						// swal.fire({title:error.data.result.message, type:"error"});
					});
				}
			})
		}
		$scope.deleteMedia = function (id) {
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
					ApiService.DELETE("media/" + id).then(res => {
						$scope.reloadTable ++;
						$scope.$apply();
						toastr.success("Xóa thành công");
					}).catch(error => {
						// swal.fire({title:error.data.result.message, type:"error"});
					});
				}
			})

		}
		$scope.exportData = () => {
			let params = $location.search();
			params.limit = 1000000;
			ApiService.GET("media",params).then(res => {
			  $scope.renderTable(res.data);
			});
		  }

		  $scope.openExcel = () => {
			$("#m_modal_excel").modal('show');
		  }
  
		  $scope.renderTable = (data) => {
			let columnsSelect=[];
			$scope.columnsExcel.map(item => {
			  if(item.select) {
				columnsSelect.push(item);
			  }
			});
			if(columnsSelect.length<1) {
			  toastr.error("Vui lòng chọn trường để xuất excel.");
			  return
			}
			$("#m_modal_excel").modal('hide');
			let tableHeader='';
			columnsSelect.forEach(item => {
			  tableHeader += '<th>'+item.title+'</th>';
			})
			let tableHtml =
			'<thead>'+
				'<tr role="row">'
				+
				tableHeader
				+
				'</tr>'+
			'</thead>';
			let tbody = '<tbody>'
			data.forEach(value => {
				let type = {1:"Sản phẩm online",2:"Sản phẩm offline",3:"Sản phẩm reach",4:"Chuyến thăm nhà tài trợ"} 
				
			  let content = '<tr>';
			  columnsSelect.forEach(item => {
				let dulieu;
				if(item.key == 'type') {
				  if(value[item.key]){
					dulieu = type[value[item.key]];
				  } else {
					dulieu = '';
				  }
				} else if(item.key == "isActive"){
				 if(value[item.key]){
					dulieu ="Đã kích hoạt";
				 } else {
					dulieu ="Chưa kích hoạt";
				 }
				} else if(item.key == "publishedTime"){
					if(value[item.key]) {
						dulieu = moment(value[item.key]).format("DD/MM/YYYY HH:mm");
					} else {
						dulieu ='';
					}
				} else if(item.key == "isEnabled"){
					if(value[item.key]){
					   dulieu ="Hiển thị";
					} else {
					   dulieu ="ẩn";
					}
				 } else{
				  if(value[item.key]) {
					dulieu =value[item.key];
				  } else {
					dulieu='';
				  } 
				}
				  
				content += '<td style="text-align:left">'+ dulieu+'</td>';
			  });
			  
			  tbody = tbody +content +'</tr>';
			});
			tableHtml = tableHtml +tbody +'</tbody>';
			ApiService.tableToExcel("Truyền thông",tableHtml);
		  }
		  
		  $scope.columnsExcel = [
			{title:"Tên", key:"name",select:true},
			{title:"Loại truyền thông", key:"type", select: true},
			{title:"Trang thái", key:"isActive", select: true},
			{title:"Ngày đăng",key:"publishedTime", select:true},
			{title:"Trạng thái hiển thị",key:"isEnabled", select:true},
			{title:"Đối tác",key:"partner", select:true},
			{title:"Linh Url",key:"linkUrl", select:true},
		  ]
		  setTimeout(() => {
			$( "#sortable_excel" ).sortable({
			  // handle: ".item-handle",
			  cursor: "move",
			  beforeStop: function (event, ui) {
				let currentIndex = parseInt($(ui.item[0]).attr("data-index"));
				let changeIndex = $("#sortable_excel .ui-state-default").index(ui.item[0]);
				$scope.columnsExcel = ApiService.moveIndex($scope.columnsExcel,currentIndex,changeIndex);
				$scope.$apply();
			  }
			});
		  },100);

	});
})();

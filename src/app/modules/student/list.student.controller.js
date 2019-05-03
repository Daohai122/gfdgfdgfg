(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("List.Student.Controller", function ($rootScope, $state, $scope, ApiService, $compile,$location,OptionService) {
		$scope.dataStudent;
		$scope.reloadTable=1;
		$scope.tableConfig = {
			requestUrl: "students",
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
				data: "code",
				orderable: true,

				title: "Mã sinh viên",
			},
			{
				data: "centerInfo.name",
				title: "Trung tâm",
			},
			{
				data: "batchInfo.name",
				title: "Khóa học",
			},
			{
				data: "classInfo.name",
				title: "Lớp học",
			},
			{
				data: null,
				title: "Tên học viên",
				render: function (data, type, full, meta) {
					if (data.middle_name != null) {
						return data.last_name + " " + data.middle_name + " " + data.first_name;
					} else {
						return data.last_name + " " + data.first_name;
					}
				}
			},
			{
				data: 'birthday',
				orderable: true,
				title: "Ngày sinh",
				render: function (data, type, full, meta) {
					// return moment(data.birthday).format("DD/MM/YYYY") + ' (' + data.age + ')';
					return moment(data).format("DD/MM/YYYY");
				}
			},
			{
				data: 'gender',
				title: "Giới tính",
				orderable: true,
				render: function (data, type, full, meta) {
					switch (data) {
						case true:
							return "Nam";
							break;
						case false:
							return "Nữ";
							break;
					}
				}
			},
			{
				data: null,
				title: "Điện thoại",
				width:"100px",
				render: function (data, type, full, meta) {
					return data.phones[0];
				}
			},
			{
				data: 'education_level',
				orderable: true,
				title: "Trình độ học vấn",
				render: function (data, type, full, meta) {
					switch (data) {
						case 1:
							return "Cấp 1";
							break;
						case 2:
							return "Cấp 2";
							break;
						case 3:
							return "Cấp 3";
							break;
						case 4:
							return "Trung học / cao đẳng";
							break;
						case 5:
							return "Đại học";
							break;
						default:
							return "";
							break;
					}
				}
			},
			{
				data: null,
				orderable: false,
				title: "Hành Động",
				class: "text-center",
				render: function (data) {
					var buttonAction = ""
					// buttonAction += '<a href="javarscipt:;" ng-click="gotoEdit(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" data-skin="light" title="" data-original-title="Sửa"><i class="la la-edit"></i></a>';
					buttonAction += '<a ui-sref="admin.student.detail.info({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" data-skin="light" title="" data-original-title="Xem chi tiết"><i class="fa fa-eye"></i></a>';
					buttonAction += '<a href="javascript:;" ng-click="deleteStudent(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip" data-skin="light" title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>';
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

		$scope.$watch("filter.list_batch", function(change) {
			if (change != undefined) {
				$scope.getClass();
			}
		}, true)

		$scope.$watch("filter.list_center", function(change) {
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
		
		$scope.getClass = () => {
			OptionService.getClass({batchIds: $scope.filter.list_batch}).then(res => {
				$scope.dataClass = res;
				$scope.$apply();
			});
		}
		
		$scope.getBatch = () => {
			OptionService.getBatch({center_codes: $scope.filter.list_center}).then(res => {
				$scope.dataBatches = res;
				$scope.$apply();
			});
		}
		$scope.getCenter();

		$scope.goToAdd = function () {
			$state.go('admin.student.add');
		}
		$scope.gotoDetail = function (id) {
			$rootScope.mode = 'view';
			$state.go('admin.student.detail.info', {
				id: id
			})
		}
		$scope.gotoEdit = function (id) {
			$rootScope.mode = 'edit';
			$state.go('admin.student.detail.info', {
				id: id
			})
		}
		$scope.deleteStudent = function (id) {
			$('[data-toggle="m-tooltip"]').tooltip('hide');
			Swal.fire({
				title: 'Bạn chắc chắn xóa?',
				showCancelButton: true,
				confirmButtonText: 'Xóa',
				cancelButtonText: 'Hủy',
				cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
				type: "warning"
			}).then(result => {
				if (result.value) {
					ApiService.DELETE("students/" + id).then(res => {
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
			ApiService.GET("students",params).then(res => {
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
				let honNhan = {1:"Độc thân", 2:"Đã lập gia đình"}
				let view  = {1:'Cấp 1', 2:"Cấp 2",3:"Cấp 3",4:'Trung học / cao đẳng',5: "Đại học"};			  let content = '<tr>';
			  columnsSelect.forEach(item => {
				let dulieu;
				if(item.key == 'name_student') {
					dulieu = value.last_name + " " + value.middle_name + " " + value.first_name
				} else if(item.key == "education_level"){
					if(value[item.key]) {
						dulieu = view[value[item.key]]
					} else {
						dulieu ="";
					}
				  
				} else if(item.key =="gender"){
					if(value[item.key]){
						dulieu ="Nam";
					}else {
						dulieu = 'Nữ';
					}
				} else if(item.key == 'centerInfo'||item.key =="batchInfo"|| item.key == "classInfo") {
					if(value[item.key]){
						dulieu = value[item.key].name?value[item.key].name:'';
					} else {
						dulieu =''
					}
					
				} else if(item.key == "birthday"){
					dulieu = ApiService.formatDate(value[item.key]);
				} else if(item.key == "marital_status") {
					dulieu = honNhan[value[item.key]];
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
			ApiService.tableToExcel("Sinh viên",tableHtml);
		  }
		  
		  $scope.columnsExcel = [
			{title:"Mã sinh viên", key:"code",select:true},
			{title:"Trung tâm", key:"centerInfo", select: true},
			{title:"Khóa học", key:"batchInfo", select: true},
			{title:"Lớp học",key:"classInfo", select:true},

			{title:"Tên học viên", key:"name_student", select: true},
			{title:"Ngày sinh",key:"birthday", select:true},
			{title:"Giới tính",key:"gender", select:true},
			{title:"Điện thoại",key:"phones", select:true},
			{title:"Email",key:"email", select:true},
			{title:"Trình độ học vấn",key:"education_level", select:true},
			{title:"Ghi chú",key:"remark", select:true},
			{title:"Lý do bỏ",key:"quit_reason", select:true},
			{title:"Địa chỉ",key:"andress_student", select:true},
			{title:"Thu nhập",key:"income_vnd", select:true},
			{title:"Số thành viên trong gia đình",key:"number_family_member", select:true},
			{title:"Nghề nghiệp bố",key:"father_job", select:true},
			{title:"Nghề nghiệp Mẹ",key:"mother_job", select:true},
			{title:"Công ty",key:"company_name", select:true},
			{title:"Tình trạng hôn nhân",key:"marital_status", select:true},
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


		// $scope.renderTable = (data) => {
		// let tableHtml = 
		// '<thead>'+
		// 	'<tr role="row">'+
		// 		'<th>Mã sinh viên</th>'+
		// 		'<th>Khóa học</th>'+
		// 		'<th>Tên học viên</th>'+
		// 		'<th>Ngày sinh</th>'+
		// 		'<th>Giới tính</th>'+
		// 		'<th>Điện thoại</th>'+
		// 		'<th>Trình độ học vấn</th>'+
		// 	'</tr>'+
		// '</thead>';
		// let tbody = '<tbody>'
		// data.forEach(value => {
		// 	let view  = {1:'Cấp 1', 2:"Cấp 2",3:"Cấp 3",4:'Trung học / cao đẳng',5: "Đại học"};
		// 	let content = '<tr>' +
		// 	'<td >'+value.code+'</td>'+
		// 	'<td >'+value.batch_name+'</td>'+
		// 	'<td >'+(value.last_name + " " + value.middle_name + " " + value.first_name)+'</td>'+
		// 	// '<td style="text-align:left">'+( ApiService.formatDate(value.birthday) + ' (' + value.age + ')')+'</td>'+
		// 	'<td style="text-align:left">'+( ApiService.formatDate(value.birthday) )+'</td>'+
		// 	'<td >'+(value.gender?"Nam":"Nữ")+'</td>'+
		// 	'<td style="text-align:left">'+(value.phones[0])+'</td>'+ 
		// 	'<td >'+(view[value.education_level]?view[value.education_level]:"")+'</td> </tr>';
		// 	'</tr>'
			
		// 	tbody = tbody +content;
		// });
		// tableHtml = tableHtml +tbody +'</tbody>';
		// ApiService.tableToExcel("Học viên",tableHtml);
		// }
	});
})();

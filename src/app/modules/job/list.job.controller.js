(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("List.Job.Controller", function ($rootScope, $state, $scope, ApiService, $compile, $location, OptionService) {
		$scope.dataJobs;
		$scope.oneJob;
		$scope.filter;
		$scope.dataCompany = {
			contact_time: "",
		};
		$scope.dataCenters;
		$scope.reloadTable=1;
		$scope.tableConfig = {
			requestUrl: "jobs",
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
				title: "Công việc",
			},
			{
				data: "title",
				orderable: true,
				title: "Chức vụ",
			},
			{
				data:"creatorName",
				orderable: true,
				title:"Người dùng"
			},
			{
				data: null,
				orderable: true,
				title: "Công ty",
				width: "15%",
				render: function (data, type, full, meta) {
					var stringText = '<span data-toggle="m-tooltip"  title="" data-original-title="'+data.address +'">' + data.company + '</span>';
					if (data.companyId == 0) {
						stringText += ' <a href="javarscipt:;" ng-click="changeCompanyType(' + meta.row + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Thêm doanh nghiệp vào hệ thống"><i class="la la-check"></i></a>'
					}
					stringText = '<div style="display: flex; justify-content: space-between; align-items: center">' + stringText+ '</div>'
					return stringText;
				},
				fnCreatedCell: function (celContent, sData) {
					$compile(celContent)($scope);
				}
			},
			// {
			// 	data: "address",
			// 	orderable: true,
			// 	title: "Địa chỉ",
			// },
			{
				data: "salary",
				orderable: true,
				title: "Lương",
				render: function (data, type, full, meta) {
					return String(data).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' vnđ';
				},
			},
			// {
			// 	data: "companyId",
			// 	title: "Loại hình doanh nghiệp",
			// 	render: function (data, type, full, meta) {
			// 		if (data == 0) {
			// 			return 'Doanh nghiệp đối tác';
			// 		} else {
			// 			return 'Doanh nghiệp của REACH';
			// 		}
			// 	},
			// },
			{
				data: null,
				orderable: false,
				title: "Hành Động",
				class: "text-center",
				render: function (data, type, full, meta) {
					var buttonList = '';
					buttonList += '<a ui-sref="admin.job.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
					'<a href="javascript:;" ng-click="deleteJob(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
					return buttonList;
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
		$scope.$watch('filter.list_center', function (newVal, oldVal) {
			if(oldVal && newVal != oldVal) {
				$scope.filter.list_batch =[];
				$scope.filter.list_class =[];
				$scope.filter.user_id="";
			}
		})
		$scope.$watch('filter.list_batch', function (newVal, oldVal) {
			if(oldVal && newVal != oldVal) {
				$scope.filter.list_class =[];
				$scope.filter.user_id="";
			}
		})
		$scope.$watch('filter.list_class', function (newVal, oldVal) {
			if(oldVal && newVal != oldVal) {
				$scope.filter.user_id="";
			}
		})

		$scope.changeCompanyType = (idx) => {
			$scope.dataCompany = {
				contact_time: "",
				name: $scope.dataJobs[idx].company,
				address: $scope.dataJobs[idx].address
			};
			$scope.oneJob = $scope.dataJobs[idx];
			$('#updateCompany').modal();
			$scope.$apply();
		}

		$scope.deleteJob = (id) => {
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
					ApiService.DELETE("jobs/" + id).then(res => {
						$scope.reloadTable++;
						$scope.$apply();
						toastr.success("Xóa thành công!");
					});
				}
			});
		}

		$scope.centerChange =() => {
			$scope.getBatches();
		}
		$scope.batchChange =() => {
			$scope.getClass();
		}
		$scope.classChange =() => {
			$scope.getStudent();
		}
		$scope.center;
		$scope.class;
		$scope.batch;
		$scope.user;
		$scope.getBatches = () => {
			if(!$scope.filter&&!$scope.filter.list_center) {
				return
			}
			OptionService.getBatch({center_codes: $scope.filter.list_center}).then(res => {
				$scope.batch = res;
				$scope.$apply();
			});
		};
		$scope.getCenter = () => {
			OptionService.getCenter().then(res => {
				$scope.center = res;
				$scope.dataCenters = res;
				$scope.$apply();
			});
		};
		$scope.getCenter();
		$scope.getClass = function () {
			if(!$scope.filter&&!$scope.filter.list_batch) {
				return
			}
			OptionService.getClass({batchIds: $scope.filter.list_batch}).then(res => {
				$scope.class = res;
				$scope.$apply();
			});
		};
		$scope.getStudent = () =>{
			if(!$scope.filter&&!$scope.filter.list_class){
				return;
			}
			let classList = {lstClassId: $scope.filter.list_class}
			ApiService.GET("/students/getListStudentByClass", classList).then(res => {
				$scope.user= res;
				$scope.$apply();
			})
		}		

		$scope.collaborates = [
		{
			value: "1",
			name: "Tuyển dụng học viên",
			selected: false
		},
		{
			value: "2",
			name: "Xây dựng giáo trình",
			selected: false
		},
		{
			value: "3",
			name: "Thực tập cho học viên",
			selected: false
		},
		{
			value: "4",
			name: "Thực tập cho giáo viên",
			selected: false
		},
		{ value: "5", name: "Khách mời giảng", selected: false },
		{
			value: "6",
			name: "Hỗ trợ tài chính",
			selected: false
		},
		{
			value: "7",
			name: "Tài trợ phi tài chính (địa điểm, in ấn, quảng cáo,...)",
			selected: false
		},
		{
			value: "8",
			name: "Thực tập cho giáo viên",
			selected: false
		},
		{ value: "9", name: "Khác", selected: false }
		];

		$scope.selection = [];

		$scope.selectedCollaborate = function() {
			return filterFilter($scope.collaborates, { selected: true });
		};

		$scope.$watch(
			"collaborates|filter:{selected:true}",
			function(nv) {
				$scope.selection = nv.map(function(collaborates) {
					return collaborates.value;
				});
			},
			true
			);

		$scope.dataProvince;

		$scope.getProvince = () => {
			ApiService.GET("address/provinces").then(res => {
				$scope.dataProvince = res;
				$scope.$apply();
			});
		};

		$scope.getProvince();
		$scope.addCompany = () => {
			$scope.dataCompany.collaborate_type = $scope.selection;
			ApiService.POST("company", $scope.dataCompany).then(res => {
				$scope.oneJob.companyId = res;
				ApiService.PUT("jobs", $scope.oneJob).then(res => {
					swal
					.fire({ title: "Cập nhật doanh nghiệp REACH thành công", type: "success" })
					.then(function(result) {
						if (result.value) {
							$('#updateCompany').modal('hide');
							$scope.reloadTable++;
							$scope.$apply();
						}
					});
				});
			});
		};

		$scope.exportData = () => {
			let params = $location.search();
			params.limit = 1000000;
			ApiService.GET("jobs",params).then(res => {
				$scope.renderTable(res.data);
			});
		}

		

		$scope.columnsExcel = [
			{title:"Công việc", key:"name",select:true},
			{title:"Chức vụ", key:"title", select: true},
			{title:"Người dùng", key:"creatorName", select: true},
			{title:"Công ty",key:"company", select:true},
			{title:"Địa chỉ công ty",key:"address", select:true},
			{title:"Lương",key:"salary", select:true},
			{title:"Loại hình doanh nghiệp",key:"companyId", select:true},
		  ]
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
			  let content = '<tr>';
			  columnsSelect.forEach(item => {
				let dulieu;
				if(item.key == 'salary') {
				  if(value[item.key]){
					dulieu = String(value.salary).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' vnđ'
				  } else {
					dulieu = '';
				  }
				} else if(item.key == "companyId"){
				  dulieu = (value[item.key] == 0 ? 'Doanh nghiệp đối tác' : 'Doanh nghiệp của REACH')
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
			ApiService.tableToExcel("Công Việc",tableHtml);
		  }
		  
		  
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

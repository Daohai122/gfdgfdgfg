(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("List.Company.Controller", function ($rootScope, $stateParams, $state, $scope, $compile, ApiService, $location) {
      $scope.reloadTable = 1;
      $scope.tableConfig = {
        requestUrl: "company",
        columns: [{
            data: null,
            title: "STT",
            width:"5%",
            class: "text-center",
            render: function (data, type, full, meta) {
              return Number(meta.settings._iDisplayStart) + meta.row + 1;
            }
          },
          {
            data: "name",
            orderable: true,
            width:"25%",
            title: "Tên doanh nghiệp",
          },
          {
            data: "contact_name",
            orderable: true,
            width:"15%",
            title: "Người liên hệ",
          },
          {
            data: "address",
            orderable: true,
            width:"25%",
            title: "Địa chỉ",
          },
          {
            data: "scale",
            orderable: true,
            width:"10%",
            title: "Quy mô",
            render: (data) => {
              let view = {
               0: 'Nhỏ',
                1: 'Vừa',
                2: 'Lớn'
              };
              return view[data]
            }
          },
          {
            data: "contact_phone",
            width:"10%",
            title: "Số điện thoại",
          },
          {
            data: null,
            orderable: false,
            width:"10%",
            title: "Hành Động",
            class: "text-center",
            render: function (data) {
              return (
                '<a ui-sref="admin.company.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                '<a href="javascript:;" ng-click="deleteCompany(' + data.id + ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
              );
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
      $scope.deleteCompany = function (id) {
        $('[data-toggle="m-tooltip"]').tooltip('hide');
        swal.fire({
          title: "Bạn chắc chắn muốn xóa doanh nghiệp này",
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          showCancelButton: true,
          cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: "warning"
        }).then(res => {
          if (res.value) {
            ApiService.DELETE('company/' + id).then(res => {
              $scope.reloadTable++;
              $scope.$apply();
              toastr.success("Xóa thành công!");
            })
          }
        })
      }
      $scope.goToAdd = function (id) {
        $state.go('admin.company.add')
      }
      $scope.exportData = () => {
        let params = $location.search();
        params.limit = 1000000;
        ApiService.GET("company",params).then(res => {
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
          let content = '<tr>';
          columnsSelect.forEach(item => {
            let scaleView = { 0: 'Nhỏ',
            1: 'Vừa',
            2: 'Lớn'}
            let industryView = {1:"Nhà hàng/Café/Tiệm bánh",2:"Hotel/Resort",3:"Siêu thị",
            4:"Cty TM/Bán hàng/Dịch vụ",5:"Beauty Salon",6:"Cty in ấn/Thiết kế",8:"Khác"};
            let collaborates = 
              {
                1: "Tuyển dụng học viên",
                2:"Xây dựng giáo trình",
                3: "Thực tập cho học viên",
                4: "Thực tập cho giáo viên",
                5: "Khách mời giảng",6: "Hỗ trợ tài chính",7: "Tài trợ phi tài chính (địa điểm, in ấn, quảng cáo,...)",
                8: "Thực tập cho giáo viên",9: "Khác" }
            let dulieu;
             if(item.key == "scale"){
              dulieu = scaleView[value[item.key]]
            } else if(item.key == "is_reach") {
              if(value[item.key]) {
                dulieu = "Có";
              } else {
                dulieu = "Không"
              }
            } else if(item.key == 'industry') {
              if(value[item.key]) {
                dulieu = industryView[value[item.key]];
              } else {
                dulieu= "";
              }
            } else if(item.key == 'collaborate_type') {
              if(value[item.key] && value[item.key].length > 0 ){
                value[item.key].forEach((e,index) => {
                  value[item.key][index]= collaborates[e];
                });
                dulieu = value[item.key].join(',');
              } else {
                dulieu = '';
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
        ApiService.tableToExcel("Doanh nghiệp",tableHtml);
      }
      
      $scope.columnsExcel = [
        {title:"Tên doanh nghiệp", key:"name",select:true},
        {title:"Người liên hệ", key:"contact_name", select: true},
        {title:"Địa chỉ", key:"address", select: true},
        {title:"Quy Mô",key:"scale", select:true},
        {title:"Số điện thoại",key:"contact_phone", select:true},
        {title:"Email",key:"contact_email", select:true},
        {title:"Doanh nghiệp của Reach",key:"is_reach", select:true},
        {title:"Hình thức hợp tác",key:"collaborate_type", select:true},
        {title:"Loại hình kinh doanh",key:"industry", select:true},
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

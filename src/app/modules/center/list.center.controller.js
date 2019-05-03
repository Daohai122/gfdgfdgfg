
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Center.Controller", function ($rootScope,$stateParams, $state, $scope,$compile, ApiService, $location) {
        $scope.reloadTable=1;
        $scope.dataCenter;
        $scope.tableConfig = {
            requestUrl: "centers",
            columns: [
              {
                data:null,
                title:"STT",
                class:"text-center",
                render: function (data, type, full, meta) {
                  return Number(meta.settings._iDisplayStart) + meta.row + 1;
                }
              },
              {
                data: "name",
                orderable: true,
                title: "Tên trung tâm",
                width:"20%"
              },
              {
                data: "code",
                orderable: true,
                title: "Mã trung tâm",
                
              },
              {
                data: "region",
                orderable: true,
                title: "Khu vực",
                defaultContent:"",
                render: function(data) {
                  let dataRegion= {1: "Miền Bắc", 2:"Miền Trung", 3: "Miền Nam"};
                  return dataRegion[data]
                }
              },
              {
                data: "address",
                orderable: true,
                title: "Địa chỉ",
                width:"25%"
              },{
                data:"status",
                orderable:true,
                title:"Trạng thái",
                render: (data) => {
                  if(data) {
                    return "Hoạt động";
                  } else {
                    return "Dừng hoạt động"
                  }
                }
              },
              {
                data: null,
                title: "Hành Động",
                class:"text-center",
                render: function (data, type, full, meta) {
                  return (
                    `<a ui-sref="admin.center.edit({id: '${data.code}'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>
                    <a href="javascript:;" ng-click="deleteCenter('${data.code}')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>`
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
        $scope.deleteCenter = function(code) {
          $('[data-toggle="m-tooltip"]').tooltip('hide');
            swal.fire({title:"Bạn chắc chắn muốn xóa trung tâm này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom", type: "warning"}).then(res => {
                if(res.value) {
                    ApiService.DELETE('centers/'+code).then(res => {
                      $scope.reloadTable++;
                      $scope.$apply();
                      toastr.success("Xóa thành công");
                    }).catch(error => {
                      // swal.fire({title:error.data.result.message,type:"error"});
                    });
                };
            });
        };
        $scope.goToAdd = function(id) {
             $state.go('admin.center.add');
        };

        // xuat excel
        $scope.exportData = () => {
          let params = $location.search();
          params.limit = 1000000;
          ApiService.GET("centers",params).then(res => {
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
            let khuvuc= {1: "Miền Bắc",2:"Miền Trung",3: "Miền Nam"};
            let content = '<tr>';
            columnsSelect.forEach(item => {
              let dulieu;
              if(item.key == 'region') {
                if(khuvuc[value[item.key]]){
                  dulieu = khuvuc[value[item.key]]
                } else {
                  dulieu ='';
                }
              } else if(item.key =="status") {
                if(value[item.key]){
                  dulieu="Hoạt động";
                } else {
                  dulieu ="Dừng hoạt động"
                }
              } else if(item.key == 'build_date') {
                if(value[item.key]) {
                  dulieu =ApiService.formatDate(value[item.key]);
                } else {
                  dulieu='';
                }
              } else {
                if(value[item.key]) {
                  dulieu =value[item.key];
                } else {
                  dulieu='';
                }
              }
              content += '<td>'+ dulieu+'</td>';
            });
            
            tbody = tbody +content +'</tr>';
          });
          tableHtml = tableHtml +tbody +'</tbody>';
          ApiService.tableToExcel("Trung tâm",tableHtml);
        }
        
        $scope.columnsExcel = [
          {title:"Tên trung tâm", key:"name",select:true},
          {title:"Mã trung tâm", key:"code", select: true},
          {title:"Trạng thái hoạt động", key:"status", select: true},
          {title:"Khu vực", key:"region", select: true},
          {title:"Địa chỉ",key:"address", select:true},
          {title:"Ngày thành lập",key:"build_date", select:true},
          {title:"Ghi chú",key:"note", select:true},
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
  
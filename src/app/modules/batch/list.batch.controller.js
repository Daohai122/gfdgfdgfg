
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Batch.Controller", function ($rootScope,$stateParams, $state, $scope,$compile, ApiService, $location, OptionService) {
        $scope.reloadTable=1;
        $scope.dataCenter;
        $scope.getCenter = () => {
          OptionService.getCenter().then(res => {
            $scope.dataCenter=res;
            $scope.$apply();
          })
        };
        $scope.getCenter();
        $scope.tableConfig = {
            requestUrl: "batches",
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
                title: "Khóa học",
              },
              {
                data: "center_name",
                // orderable: true,
                title: "Trung tâm",
              },
              {
                data: "authorised_person",
                orderable: true,
                title: "Người phụ trách",
              },
              {
                data: null,
                title: "Hành Động",
                class:"text-center",
                render: function (data, type, full, meta) {
                  return (
                    '<a ui-sref="admin.batch.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteBatch('+data.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
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
        $scope.deleteBatch = function(id) {
          $('[data-toggle="m-tooltip"]').tooltip('hide');
            swal.fire({title:"Bạn chắc chắn muốn xóa khóa học này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true,cancelButtonClass: " btn btn-danger m-btn m-btn--custom",type: "warning"}).then(res => {
                if(res.value) {
                    ApiService.DELETE('batches/'+id).then(res => {
                      $scope.reloadTable++;
                      $scope.$apply();
                      toastr.success("Xóa thành công");
                    });
                };
            });
        };
        $scope.goToAdd = function(id) {
             $state.go('admin.batch.add');
        };
        // xuat excel
        $scope.exportData = () => {
          let params = $location.search();
          params.limit = 1000000;
          ApiService.GET("batches",params).then(res => {
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
              if(value[item.key]) {
                dulieu =value[item.key];
              } else {
                dulieu='';
              }
              content += '<td >'+ dulieu+'</td>';
            });
            
            tbody = tbody +content +'</tr>';
          });
          tableHtml = tableHtml +tbody +'</tbody>';
          ApiService.tableToExcel("Khóa",tableHtml);
        }
        
        $scope.columnsExcel = [
          {title:"Khóa học", key:"name",select:true},
          {title:"Mã khóa học", key:"code", select: true},
          {title:"Trung tâm",key:"center_name", select:true},
          {title:"Người phụ trách",key:"authorised_person", select:true},
          {title:"Thời gian bắt đầu",key:"start_time", select:true},
          {title:"Mục tiêu tuyển sinh",key:"goal", select:true},
          {title:"Mức lương chuẩn",key:"standard_salary", select:true},
          {title:"Mức lương trần",key:"ceil_salary", select:true},
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
  
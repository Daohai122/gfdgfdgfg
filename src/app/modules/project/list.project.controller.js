(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Project.Controller", function ($rootScope, $state, $scope,$compile, ApiService,$location, OptionService) {
        $scope.reloadTable=1;
        $scope.dataCenter;
        $scope.dateParners;
        
        $scope.getCenter = () => {
          OptionService.getCenter().then(res => {
            $scope.dataCenter = res;
            $scope.$apply();
            // $("#center_select").selectpicker();
          });
        };
        $scope.getParnert = () => {
          ApiService.GET("partners").then(res => {
            $scope.dateParners = res.data;
            $scope.$apply();
            // $("#center_partner").selectpicker();
          });
        };
        $scope.getCenter();
        $scope.getParnert();
        $scope.tableConfig = {
            requestUrl: "projects",
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

                title: "Tên dự án",
              },
              {
                data: "cost",
                orderable: true,
                title: "Tổng kinh phí",
              },
              {
                data: "approved_date",
                orderable: true,
                title: "Ngày phê duyệt",
                type:   'date',
              },
              {
                data: "manager_person",
                orderable: true,
                title: "Quản lý",
              },
              {
                data: "status",
                orderable: true,
                title: "Trạng thái dự án",
                render: (data) => {
                    let dataRender = {1:'Chưa bắt đầu',2:"Đang thực hiện",3:"Đã hoàn thành"};
                    return dataRender[data];
                }
              },
              {
                data: null,
                orderable: false,
                title: "Hành Động",
                class:"text-center",
                render: function (data) {
                  return (
                    '<a ui-sref="admin.project.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteProject('+data.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
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
        $scope.deleteProject = function(id) {
          $('[data-toggle="m-tooltip"]').tooltip('hide');
            swal.fire({title:"Bạn chắc chắn muốn xóa dự án này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true}).then(res => {
                if(res.value) {
                    ApiService.DELETE('projects/'+id).then(res => {
                      $scope.reloadTable++;
                      $scope.$apply();
                      toastr.success("Xóa thành công!");
                    }).catch(error => {
                      // swal.fire({title:error.data.result.message, type:"error"})
                    });
                }
            })
        }
        $scope.goToAdd = function(id) {
             $state.go('admin.project.add')
        }
        $scope.exportData = () => {
          let params = $location.search();
          params.limit = 1000000;
          ApiService.GET("projects",params).then(res => {
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
            let statusView = {1:"Chưa bắt đầu",2:"Đang thực hiên",3:"Đã hoàn thành"}
            let content = '<tr>';
            columnsSelect.forEach(item => {
              let dulieu;
              if(item.key == 'from_date' || item.key =="to_date" || item.key=="approved_date") {
                if(value[item.key]){
                  dulieu = ApiService.formatDate(value[item.key]);
                } else {
                  dulieu = '';
                }
              } else if(item.key == "partnerInfo"){
                if(value[item.key] && value[item.key].length > 0){
                  let view =[];
                  value[item.key].forEach(element => {
                    view.push(element.name);
                  });
                  dulieu = view.join(', ');
                } else {
                  dulieu="";
                }
              } else if(item.key == "centerInfo"){
                if(value[item.key] && value[item.key].length > 0){
                  let view =[];
                  value[item.key].forEach(element => {
                    view.push(element.name);
                  });
                  dulieu = view.join(', ');
                } else {
                  dulieu="";
                }
              } else if(item.key == "status"){
                dulieu = statusView[value[item.key]]
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
          ApiService.tableToExcel("Dự án",tableHtml);
        }
        
        $scope.columnsExcel = [
          {title:"Tên dự án", key:"name",select:true},
          {title:"Tổng kinh phí", key:"cost", select: true},
          {title:"Ngày phê duyệt", key:"approved_date", select: true},
          {title:"Trạng thái dự án",key:"status", select:true},
          {title:"Nhà tài trợ",key:"partnerInfo", select:true},
          {title:"Trung tâm",key:"centerInfo", select:true},
          {title:"Mục tiêu dự án",key:"target", select:true},
          {title:"lý do gia hạn dự án",key:"adjourn_reason", select:true},
          {title:"Địa chỉ văn phòng",key:"address_office", select:true},
          {title:"Địa bàn làm việc của quản lý dự án",key:"manager_designation", select:true},
          {title:"Thời gian bắt đầu",key:"from_date", select:true},
          {title:"Thời gian kết thúc",key:"to_date", select:true},
          {title:"Người quản lý dự án",key:"manager_person", select:true},
          {title:"Điện thoại người quản lý",key:"manager_phone", select:true},
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
  
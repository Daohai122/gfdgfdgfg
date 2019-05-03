
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Studyfield.Controller", function ($rootScope, $state, $scope,ApiService,$compile,$location, OptionService) {
        $scope.reloadTable=1;
        $scope.dataStudyfield;
        $scope.tableConfig = {
            requestUrl: "studyField",
            columns: [
              {
                data:null,
                title:"STT",
                class:"text-center",
                width:"100",
                render: function (data, type, full, meta) {
                  return Number(meta.settings._iDisplayStart) + meta.row + 1;
                }
              },
              {
                data: "name",
                orderable: true,
                title: "Ngành học",
              },
              {
                data: "code",
                orderable: true,
                title: "Mã ngành học",
              },
              {
                data: null,
                orderable: true,
                title: "Giáo viên",
                render: (data, type, full, meta) => {
                  let teacher = [];
                  if(data.teacherInfo && data.teacherInfo.length> 0) {
                    data.teacherInfo.forEach(item => {
                      teacher.push(item.name);
                    });
                    return teacher.join(', ')
                  } else {
                    return '';
                  }
                }
              },
              {
                data: "month",
                orderable: true,
                title: "Thời gian(tháng)",
              },
    
              {
                data: "description",
                orderable: true,
                title: "Mô tả",
              },
              {
                data: null,
                orderable: false,
                title: "Hành Động",
                class:"text-center",
                width:"150",
                render: function (data, type, full, meta) {
                  return (
                    '<a ui-sref="admin.studyfield.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteStudyfield('+ meta.row+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
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
          $scope.deleteStudyfield=(id)=> {
            $('[data-toggle="m-tooltip"]').tooltip('hide');
              swal.fire({title:"Bạn chắc chắn muốn xóa ngành này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
              type: "warning"}).then(res => {
                if(res.value) {
                    ApiService.DELETE('studyField/'+$scope.dataStudyfield[id].id).then(res => {
                      $scope.reloadTable++;
                      $scope.$apply();
                      toastr.success("Xóa thành công!");
                    }).catch(error => {
                      // swal.fire({title:error.data.result.message,type:"error"});
                    })
                };
            });
          };
        $scope.gotoEdit = function(id) {
          $state.go('admin.studyfield.edit',{id:$scope.dataStudyfield[id].id});
        };
        $scope.getCenter = () => {
          OptionService.getCenter().then(res => {
            $scope.dataCenter=res;
            $scope.$apply();
            $('.m-bootstrap-select').selectpicker('refresh');
          })
        };
        $scope.getCenter();
        $scope.goToAdd = function(id) {
          $state.go('admin.studyfield.add');
        };

        $scope.exportData = () => {
          let params = $location.search();
          params.limit = 1000000;
          ApiService.GET("studyField",params).then(res => {
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
              let dulieu;
              if(item.key == "teacherInfo") {
                if(value[item.key] && value[item.key].length > 0){
                  let teacher=[];
                  value[item.key].forEach(item => {
                    debugger;

                    teacher.push(item.name);
                  });
                  
                  dulieu = teacher.join(', ');
                }else {
                  dulieu = '';
                }
              } else if(value[item.key]) {
                dulieu =value[item.key];
              } else {
                dulieu='';
              }
              content += '<td>'+ dulieu+'</td>';
            });
            
            tbody = tbody +content +'</tr>';
          });
          tableHtml = tableHtml +tbody +'</tbody>';
          ApiService.tableToExcel("Ngành học",tableHtml);
        }
        
        $scope.columnsExcel = [
          {title:"Ngành học", key:"name",select:true},
          {title:"Mã ngành học", key:"code", select: true},
          {title:"Mã trung tâm", key:"center_code", select: true},
          {title:"Thời gian(tháng)", key:"month", select: true},
          {title:"Mô tả",key:"description", select:true},
          {title:"Giáo viên",key:"teacherInfo", select:true},
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
  
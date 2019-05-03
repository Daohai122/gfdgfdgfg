
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.User.Controller", function ($rootScope, $stateParams, $state, $scope, ApiService,$compile, $location) {
        $scope.reloadTable=1;
        $scope.dataUser;
        $scope.tableConfig = {
            requestUrl: "users/ListUserReach",
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
                title: "Name",
              },
              {
                data:'userName',
                orderable: true,
                title:"Tài khoản"
              },
              {
                data: "emailAddress",
                orderable: true,
                title: "Email",
              },
              {
                data: "roleName",
                orderable: true,
                title: "Quyền",
                render: (data) => {
                  return data.join(',')
                  // let view = {0:'admin',1:"Student",2:"Alumni",3:"Guest"};
                  // return view[data]
                }
              },
              {
                data: "phone",
                orderable: true,
                title: "Số điện thoại",
              },
              {
                data:null,
                orderable: false,
                title:"Trạng thái",
                class: "text-center",
                render: (data, type, full, meta) => {
                  return `<span class="m-switch m-switch--icon "><label>
                    <input ng-model="dataUser[${meta.row}].isActive" ng-click="updateApproved('${meta.row}')" type="checkbox"><span></span></label>
                    </span>`;
                },
                fnCreatedCell: function (celContent, sData) {
                  $compile(celContent)($scope);
                }
              },
              {
                data: null,
                title: "Hành Động",
                class:"text-center",
                render: function (data) {
                  return (
                    '<a ui-sref="admin.user.edit({id: '+data.id+'})"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteUser('+data.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
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
          
        $scope.deleteUser = (id) => {
          $('[data-toggle="m-tooltip"]').tooltip('hide');
          swal.fire({title:"Bạn chắc muốn xóa?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
          type: "warning" }).then(res => {
            if(res.value){
              ApiService.DELETE("users/" +id).then(res => {
                toastr.success("Xóa người dùng thành công!");
              }).catch(error => {
                // Swal.fire({title:error.data.result.message, type: "error"});
              });
            }
          });
        }
        $scope.updateApproved = (index) => {
          let data = $scope.dataUser[index];
          let url;
          if(data.isActive){
            url ='users/SetActived/';
          } else {
            url ='users/SetBlocked/';
          }
          ApiService.PUT(url + data.userName).then(res => {
            toastr.success("Cập nhật thành công!");
          })
        }
        $scope.goToAdd = (id) => {
          $state.go("admin.user.add")
        }
        $scope.gotoEdit = (id) => {
          $state.go("admin.user.edit",{id:id})
        }
        $scope.exportData = () => {
          let params = $location.search();
          params.limit = 1000000;
          ApiService.GET("users/ListUserReach",params).then(res => {
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
              if(item.key == 'gender') {
                if(value[item.key]){
                  dulieu = 'Nam'
                } else {
                  dulieu ='Nữ';
                }
              } else if(item.key == 'isActive') {
                if(value[item.key]) {
                  dulieu = "Đang hoạt động";
                } else {
                  dulieu='Không hoạt động';
                }
              } else if(item.key =="roleName"){
                dulieu = value[item.key].join(',');
              }
               else {
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
          ApiService.tableToExcel("Tài khoản",tableHtml);
        }
        
        $scope.columnsExcel = [
          {title:"Họ tên", key:"name",select:true},
          {title:"Tài khoản", key:"userName", select: true},
          {title:"Email", key:"emailAddress", select: true},
          {title:"Giới tính", key:"gender", select: true},
          {title:"Quyền",key:"roleName", select:true},
          // {title:"Quyền theo trung tâm",key:"center_code_permissions", select:true},
          // {title:"Quyền theo khóa",key:"batch_permisisons", select:true},
          // {title:"Quyền theo lớp",key:"class_permissions", select:true},
          {title:"Số điện thoại",key:"phone", select:true},
          {title:"Trạng thái",key:"isActive", select:true},
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
  
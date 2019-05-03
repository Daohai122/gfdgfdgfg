(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("List.Partner.Controller", function(
      $rootScope,
      $state,
      $scope,
      $compile,
      ApiService,
      $location
    ) {
      $scope.reloadTable=1;
      $scope.dataPartnerEdit;
      $scope.dataPartner;
      $scope.tableConfig = {
        requestUrl: "partners",
        columns: [
          {
            data: null,
            title: "STT",
            class: "text-center",
            render: function(data, type, full, meta) {
              return Number(meta.settings._iDisplayStart) + meta.row + 1;
            }
          },
          {
            data: null,
            orderable: true,
            title: "Tên đối tác",
            render: (data) => {
              let name = data.contact_type?data.contact_type + data.name:data.name;
              return name;
            }
          },
          {
            data: "partner_type",
            orderable: true,
            title: "Loại hình hợp tác",
            render: (data) => {
              let view  = {1:'Đối tác chương trình', 2:"Báo chí",3:"Nhà tài trợ",4:'Nhà tài trợ tiềm năng',5: "Tuyển sinh", 6: 'đào tạo'};
              if(data) {
                return view[data];
              } else {
                return ""
              }
            }
          },
          
          {
            data: null,
            orderable: false,
            title: "Hành Động",
            class: "text-center",
            render: function(data, type, full, meta) {
              return (
                '<a ui-sref="admin.partner.edit({id: ' + data.id +'})" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                '<a href="javascript:;" ng-click="deleteCenter(' +
                data.id +
                ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
                
                //+ '<a href="javascript:;" ng-click="viewPartner(' +
                // data.id +
                // ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xem"><i class="flaticon-eye"></i></a>'
              );
            },
            fnCreatedCell: function(celContent, sData) {
              $compile(celContent)($scope);
            }
          }
        ],
        fnDrawCallback: function(oSettings) {
          $('[data-toggle="m-tooltip"]').tooltip({
            placement: "auto"
          });
        }
      };
      $scope.deleteCenter = function(id) {
        $('[data-toggle="m-tooltip"]').tooltip('hide');
        swal
          .fire({
            title: "Bạn chắc chắn muốn xóa đối tác này?",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            showCancelButton: true
          })
          .then(res => {
            if (res.value) {
              ApiService.DELETE("partners/" + id).then(res => {
                $scope.reloadTable++;
                $scope.$apply();
                toastr.success("Xóa thành công!");
              });
            }
          });
      };
      $scope.editPartnerContact = (id) =>  {
        $("#modal_partner").modal('hide');
        $state.go("admin.partner.editContact", { id: $scope.dataPartnerEdit.partnerContacts[id].id }); 
      }
      $scope.goToAdd = function(id) {
        $state.go("admin.partner.add");
      };

      $scope.goToAddContact = (id) => {
        $("#modal_partner").modal('hide');
        $state.go("admin.partner.addContact",{id:$scope.dataPartnerEdit.id});
        
      };
      $scope.idView;
      $scope.viewPartner= (id) => {
        if(id) {
          $scope.idView=id;
        }
        ApiService.GET('partners/' +$scope.idView).then(res => {
          $scope.dataPartnerEdit = res;
          if($scope.dataPartnerEdit.partnerContacts) {
            for(let i = 0; i< $scope.dataPartnerEdit.partnerContacts.length;i++) {
              if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 0){
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Gặp trực tiếp";
              } else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 1) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Email";
              }else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 2) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Website";
              }else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 3) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Sự kiện reach tổ chức";
              }else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 4) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Báo chí";
              }else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 5) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Mạng lưới NGO";
              }else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 6) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Mạng xã hội";
              }else if($scope.dataPartnerEdit.partnerContacts[i].from_channel == 7) {
                $scope.dataPartnerEdit.partnerContacts[i].from_channel = "Khác";
              } 
            }
          }
          $scope.$apply();
          $("#modal_partner").modal('show');
        });
      };


      $scope.exportData = () => {
        let params = $location.search();
        params.limit = 1000000;
        ApiService.GET("partners",params).then(res => {
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
          let view  = {1:'Đối tác chương trình', 2:"Báo chí",3:"Nhà tài trợ",4:'Nhà tài trợ tiềm năng',5: "Tuyển sinh", 6: 'đào tạo'};
          let content = '<tr>';
          columnsSelect.forEach(item => {
            let dulieu;
            if(item.key == "partner_type"){
              if(view[value[item.key]]){
                dulieu = view[value[item.key]]
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
        ApiService.tableToExcel("Đối tác",tableHtml);
      }
      
      $scope.columnsExcel = [
        {title:"Họ tên", key:"name",select:true},
        {title:"Loại hình hợp tác", key:"partner_type", select: true},
      
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
      //   let tableHtml = 
      //   '<thead>'+
      //       '<tr role="row">'+
      //           '<th>Họ tên</th>'+
      //           '<th>Loại hình hợp tác</th>'+
                
      //       '</tr>'+
      //   '</thead>';
      //   let tbody = '<tbody>'
      //   data.forEach(value => {
      //     let view  = {1:'Đối tác chương trình', 2:"Báo chí",3:"Nhà tài trợ",4:'Nhà tài trợ tiềm năng',5: "Tuyển sinh", 6: 'đào tạo'};

      //     let content = '<tr>' +
      //     '<td>'+(value.contact_type?value.contact_type + value.name:value.name)+'</td>'+
      //     '<td>'+(view[value.partner_type]?view[value.partner_type]:"")+'</td> </tr>';
          
      //     tbody = tbody +content;
      //   });
      //   tableHtml = tableHtml +tbody +'</tbody>';
      //   ApiService.tableToExcel("Đối Tác",tableHtml);
      // }
    });
})();

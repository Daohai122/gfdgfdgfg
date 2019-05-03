
(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Edit.Partner.Controller", function ($rootScope, $state, $scope,ApiService,$stateParams) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.getPartner();
    });
    $scope.dataPartner;
    $scope.dataProvince;
    $scope.dataPartnerContact;
    $scope.mode;
    $scope.goToList = () => {
      $state.go("admin.partner.list");
    }
    $scope.AddPartner =() => {
      ApiService.PUT('partners',$scope.dataPartner).then(res => {
        swal.fire({title:"Update đối tác thành công!", type:"success"}).then(function(result){
          if(result.value){
            $state.go('admin.partner.list');
          }
        })
      });
    };
   
    $scope.getProvince = () => {
      return ApiService.GET('/address/country').then(res => {
       return res
     });
   };
    $scope.getPartner =() => {
      ApiService.GET('partners/' + $stateParams.id).then(res => {
        $scope.dataPartner = res;
        if($scope.dataPartner.partner_type){
        $scope.dataPartner.partner_type=$scope.dataPartner.partner_type.toString();
        };
        if($scope.dataPartner.partnerContacts){
          for(let i = 0; i< $scope.dataPartner.partnerContacts.length;i++) {
            if($scope.dataPartner.partnerContacts[i].from_channel == 0){
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Gặp trực tiếp";
            } else if($scope.dataPartner.partnerContacts[i].from_channel == 1) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Email";
            }else if($scope.dataPartner.partnerContacts[i].from_channel == 2) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Website";
            }else if($scope.dataPartner.partnerContacts[i].from_channel == 3) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Sự kiện reach tổ chức";
            }else if($scope.dataPartner.partnerContacts[i].from_channel == 4) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Báo chí";
            }else if($scope.dataPartner.partnerContacts[i].from_channel == 5) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Mạng lưới NGO";
            }else if($scope.dataPartner.partnerContacts[i].from_channel == 6) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Mạng xã hội";
            }else if($scope.dataPartner.partnerContacts[i].from_channel == 7) {
              $scope.dataPartner.partnerContacts[i].from_channel_text = "Khác";
            }
          }
        }
        $scope.$apply();
      });
    };
    $scope.deletePartnerContact = (id) =>  {
      $('[data-toggle="m-tooltip"]').tooltip('hide');
      swal.fire({
          title: "Bạn chắc chắn muốn xóa liên hệ này?",
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          showCancelButton: true,
          cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
				type: "warning"
        })
        .then(res => {
          if (res.value) {
            ApiService.DELETE("partnerContacts/" + $scope.dataPartner.partnerContacts[id].id).then(res => {
              $scope.getPartner();
              toastr.success("Xóa thành công!");
            });
          }
        });
    }
    $scope.updatePartnerContact = () => {
      if($scope.mode == "them"){
        $scope.AddPartnerContact();
      } else {
        ApiService.PUT('partnerContacts', $scope.dataPartnerContact ).then(res => {
          swal.fire({title:"Update đối tác thành công!", type:"success"});
          $scope.getPartner();  
        });
      }
      
    };
    $scope.AddPartnerContact = () => {
      $scope.dataPartnerContact.partner_id = $stateParams.id;
      ApiService.POST('partnerContacts',$scope.dataPartnerContact).then(res => {
        $scope.getPartner();
        swal.fire({title:"Thêm mới đối tác thông tin thành công!", type:"success"});
      });
    };
    // $scope.getPartnerContact =(id) => {
    //   ApiService.GET('partnerContacts/' + id).then(res => {
    //     $scope.dataPartnerContact = res;
    //     $scope.$apply();
    //   });
    // };
    $scope.viewPartnerContact = (id) => {
      $scope.mode = 'sua';
      $scope.dataPartnerContact = $scope.dataPartner.partnerContacts[id];
      $("#m_modal_contact").modal('show');

    }
    $scope.addPartnerContact = () => {
      $scope.mode = 'them';
      $scope.dataPartnerContact={
        country:'',
      };
      $("#m_modal_contact").modal('show');
    }
  });
})();

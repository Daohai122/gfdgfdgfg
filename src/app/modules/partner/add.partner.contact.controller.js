
(function () {
    "use strict";
    angular
    .module("MyApp")
    .controller("Add.Partner.Contact.Controller", function ($rootScope, $state, $stateParams, $scope,ApiService) {
      
      $scope.dataPartner;
      $scope.dataProvince;
      $scope.dataUser;
      $scope.AddPartnerContact = () => {
        $scope.dataPartner.partner_id = $stateParams.id;
        ApiService.POST('partnerContacts',$scope.dataPartner).then(res => {
          swal.fire({title:"Thêm mới đối tác thành công!", type:"success"}).then(function(result){
            if(result.value){
              $state.go('admin.partner.list');
            };
          });
        });
      };
      $scope.goToList = () => {
        $state.go("admin.partner.list");
      }
      $scope.getProvince = () => {
         return ApiService.GET('/address/country').then(res => {
          return res
        });
      };
    });
  })();
  
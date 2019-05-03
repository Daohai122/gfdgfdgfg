
(function () {
    "use strict";
    angular
    .module("MyApp")
    .controller("Edit.Partner.Contact.Controller", function ($rootScope, $state, $scope,ApiService,$stateParams) {
      $scope.updatePartnerContact = () => {
        ApiService.PUT('partnerContacts',$scope.dataPartner).then(res => {
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
        ApiService.GET('partnerContacts/' + $stateParams.id).then(res => {
          $scope.dataPartner = res;
          $scope.$apply();
        });
      };
      setTimeout(() => {
        $scope.getPartner();
      },1000)
     
      $scope.goToList =() => {
        $state.go('admin.partner.list');
      }
    });
  })();
  
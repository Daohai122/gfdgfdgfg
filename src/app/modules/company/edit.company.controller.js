
(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Edit.Company.Controller", function(
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      OptionService
    ) {
      $scope.dataProvince;
      $scope.dataCompany;
      $scope.dataCenters;
      $scope.dataCompanyContact;
      $("#select_center").select2({
        placeholder:"Chọn trung tâm"
      }).on("select2:close", (data) => {
        $scope.dataCompany.centers= $("#select_center").val();
        $scope.$apply();
      });
      $scope.getProvince = () => {
        return new Promise((resolve, reject) => {
          ApiService.GET("address/provinces").then(res => {
            $scope.dataProvince = res;
            $scope.$apply();
            resolve(true);
          });
        });
      };
      $scope.getCenter = () => {
        return new Promise((resolve, reject)=> {
          OptionService.getCenter().then(res => {
            $scope.dataCenters = res;
            $scope.$apply();
            resolve(true)
          });
        });
      }
      $scope.getCompany = () => {
        ApiService.GET("company/" + $stateParams.id).then(res => {
          $scope.dataCompany = res;
          $scope.dataCompanyContact = $scope.dataCompany.contacts;
          $scope.$apply();
          $("#select_center").val($scope.dataCompany.centers).trigger("change");
          $scope.dataCompany.is_reach = $scope.dataCompany.is_reach.toString();
          $scope.dataCompany.scale = $scope.dataCompany.scale.toString();
          $scope.dataCompany.contact_type = $scope.dataCompany.contact_type.toString();
          if ( $scope.dataCompany.collaborate_type && $scope.dataCompany.collaborate_type.length > 0) {
            for (let i = 0;i < $scope.dataCompany.collaborate_type.length; i++) {
              for (let j = 0; j < $scope.collaborates.length; j++) {
                if ($scope.collaborates[j].value == $scope.dataCompany.collaborate_type[i]) {
                  $scope.collaborates[j].selected = true;
                  $scope.$apply();
                }
              }
            }
          }
          $scope.dataCompany.collaborate_type;
        });
      };
      $scope.getCenter().then(res => {
        $scope.getProvince().then(res => {
          $scope.getCompany();
        });
      });
     

      // sửa lý phần check box
      $scope.collaborates = [
        {
          value: "0",
          name: "Tuyển dụng học viên",
          selected: false
        },
        {
          value: "1",
          name: "Xây dựng giáo trình",
          selected: false
        },
        {
          value: "2",
          name: "Thực tập cho học viên",
          selected: false
        },
        {
          value: "3",
          name: "Thực tập cho giáo viên",
          selected: false
        },
        { value: "4", name: "Khách mời giảng", selected: false },
        {
          value: "5",
          name: "Hỗ trợ tài chính",
          selected: false
        },
        {
          value: "6",
          name: "Tài trợ phi tài chính (địa điểm, in ấn, quảng cáo,...)",
          selected: false
        },
        {
          value: "7",
          name: "Thực tập cho giáo viên",
          selected: false
        },
        { value: "8", name: "Khác", selected: false }
      ];

      $scope.selection = [];

      $scope.selectedCollaborate = function() {
        return filterFilter($scope.collaborates, { selected: true });
      };

      $scope.$watch(
        "collaborates|filter:{selected:true}",
        function(nv) {
          $scope.selection = nv.map(function(collaborates) {
            return collaborates.value;
          });
        },
        true
      );
      // KẾT THÚC

      $scope.updateCompany = () => {
        $scope.dataCompany.collaborate_type = $scope.selection;
        ApiService.PUT("company", $scope.dataCompany).then(
          res => {
            swal
              .fire({ title: "Sửa doanh nghiệp thành công", type: "success" })
              .then(function(result) {
                if (result.value) {
                  $state.go("admin.company.list");
                }
              });
          }
        );
      };
      $scope.mode="them";
      $scope.goToList = () => {
        
        $state.go("admin.company.list");
      }
      $scope.addCompanyContact = () => {
        $scope.mode="them";
        $scope.contactSelect={};
        $("#m_modal_contact").modal("show");
      }
      $scope.contactSelect;
      $scope.editContact = (id) => {
        $scope.mode="sua";
        $scope.contactSelect = $scope.dataCompanyContact[id];
        $("#m_modal_contact").modal("show");
      }

      $scope.deleteContact =(index) => {
        swal.fire({title:'Bạn chắc xóa thông tin liên hệ này?',confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true, cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
        type: "warning"}).then(res => {
          if(res.value){
            let id= $scope.dataCompanyContact[index].id;
            ApiService.DELETE("companycontacts/" + id).then(res => {
              toastr.success("Xóa thành công.");
              $scope.getCompany();
            }).catch(error => {
              // toastr.error(error.data.result.message);
            })
          }
        });
      } 
      // thêm company contact
      $scope.updateCompanyContact = () => {
        if($scope.mode=="them"){
          $scope.contactSelect.company_id = $stateParams.id;
          ApiService.POST("/companycontacts", $scope.contactSelect).then(res => {
            toastr.success("Thêm thông tin liên lạc thành công.");
            $("#m_modal_contact").modal("hide");
            $scope.getCompany();
            $scope.contactSelect = {};
          }).catch(error => {
            // swal.fire({title:error.data.result.message, type:"error"});
          })
        } else{
          $scope.contactSelect.company_id = $stateParams.id;
          ApiService.PUT("companycontacts",$scope.contactSelect).then(res => {
            toastr.success("Cập nhật thông tin liên lạc thành công.");
            $("#m_modal_contact").modal("hide");
            $scope.contactSelect = {};
            $scope.getCompany();
          }).catch(error => {
            // swal.fire({title:error.data.result.message, type:"error"});
          })
        }
      }
    });
})();

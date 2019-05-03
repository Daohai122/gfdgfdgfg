(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Add.Company.Controller", function(
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      OptionService
    ) {
      $scope.dataCompany = {
        contact_time: ""
      };
      $scope.dataCenters;
      $scope.getCenters=() => {
        OptionService.getCenter().then(res => {
          $scope.dataCenters = res;
          $scope.$apply();
        });
      }
      $scope.getCenters();
      $("#select_center").select2({
        placeholder:"Select..."
      }).on("select2:close", (data) => {
        $scope.dataCompany.centers= $("#select_center").val();
        $scope.$apply();
      });
      // sửa lý phần check box
      $scope.collaborates = [
        {
          value: "1",
          name: "Tuyển dụng học viên",
          selected: false
        },
        {
          value: "2",
          name: "Xây dựng giáo trình",
          selected: false
        },
        {
          value: "3",
          name: "Thực tập cho học viên",
          selected: false
        },
        {
          value: "4",
          name: "Thực tập cho giáo viên",
          selected: false
        },
        { value: "5", name: "Khách mời giảng", selected: false },
        {
          value: "6",
          name: "Hỗ trợ tài chính",
          selected: false
        },
        {
          value: "7",
          name: "Tài trợ phi tài chính (địa điểm, in ấn, quảng cáo,...)",
          selected: false
        },
        {
          value: "8",
          name: "Thực tập cho giáo viên",
          selected: false
        },
        { value: "9", name: "Khác", selected: false }
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

      $scope.dataProvince;

      $scope.getProvince = () => {
        ApiService.GET("address/provinces").then(res => {
          $scope.dataProvince = res;
          $scope.$apply();
        });
      };
      $scope.getProvince();
      $scope.addCompany = () => {
        $scope.dataCompany.collaborate_type = $scope.selection;
        ApiService.POST("company", $scope.dataCompany).then(res => {
          swal
            .fire({ title: "Thêm doanh nghiệp thành công", type: "success" })
            .then(function(result) {
              if (result.value) {
                $state.go("admin.company.list");
              }
            });
        });
      };
      $scope.goToList = () => {
        $state.go("admin.company.list");
      }
    });
    
})();

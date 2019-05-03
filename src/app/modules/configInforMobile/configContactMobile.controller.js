(function() {
  "use strict";
  angular
    .module("MyApp")
    .controller("Config.Contact.Mobile.Controller", function(
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService
    ) {
      $scope.$on("$viewContentLoaded", function() {
        $scope.getInfor();
      });
      $scope.dataConfig;
      $scope.createColorPicker = () => {
        $(".color_picker").each(function() {
          $(this).minicolors({
            control: $(this).attr("data-control") || "hue",
            defaultValue: "",
            inline: "true" === $(this).attr("data-inline"),
            letterCase: $(this).attr("data-letterCase") || "lowercase",
            opacity: $(this).attr("data-opacity"),
            position: $(this).attr("data-position") || "bottom left",
            change: function(t, o) {
              let index = $(this).attr('data-color-index');
              $scope.dataConfig.link[index].color = t;

              // t &&
              //   (o && (t += ", " + o),
              //   "object" == typeof console && console.log(t));
            },
            theme: "bootstrap"
          });
        });
      };
      $scope.deleteInfor = (index) => {
        $scope.dataConfig.link.splice(index,1);
      }
      $scope.addInfor = () => {
        $scope.dataConfig.link.push({title:"", url:'',color:''});
        setTimeout(() => {$scope.createColorPicker()},300);
      }
      $scope.updateInfor = () => {
        let data={
          name: "mobile-reference-link",
          value: JSON.stringify($scope.dataConfig)
        }
        ApiService.PUT("settings",data).then(res => {
          toastr.success("Cập nhật thành công!");
        })
      };
     
      $scope.getInfor = () => {
        ApiService.GET("settings/mobile-reference-link").then(res => {
          $scope.dataConfig= JSON.parse(res);
          $scope.$apply();
          setTimeout(() => {$scope.createColorPicker()},300);
        })
      }
    })

})();

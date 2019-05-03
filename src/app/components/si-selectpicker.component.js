/**
Tham khảo tài liệu select picker: https://developer.snapappointments.com/bootstrap-select
*/
(function () {
  "use strict";
  angular.module("MyApp").directive('siSelectpicker', function ($compile, $q, ApiService) {

    return {
      restrict: 'A',
      scope: {
        width: '@',
        boostrapClass: '@',
        placeholder: '@',
        data: '=',
        ngModel: '=?',
        multiple: '@',
        update: '=?',
        keyValue: "@",
        keyText: "@",
        search: "@",
        actionsBox: "@"
        // mappingData: "="
      },
      // transclude: true,
      // template: `<select class="form-control"><option value=""></option><option ng-repeat="i in mappingData" value="{{i.value}}">{{i.text}}</option></select>`,
      link: function ($scope, $element, $attrs) {
        var unbind;

        var init = function () {
          $($element).selectpicker({
            liveSearch: $scope.search == "false" ? false : true,
            selectAllText: "Tất cả",
            deselectAllText: "Bỏ chọn",
            // header: true,
            actionsBox: $scope.actionsBox == "true" ? true : false,
            // style: "btn-info"
          });
          $($element).on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
            $(this).closest('.form-group').removeClass('has-error'); // set error class to the control group
            $(this).closest('.form-group').find('.help-block.help-block-error').remove();
          });
        }


        init();

        // reload select  khi data thay đổi
        $scope.$watch('update', (newVal, oldVal) => {
          if (newVal != undefined) {
            setTimeout(function () {
              // $($element).selectpicker();
              $($element).selectpicker("refresh");
            }, 200)
          }
        }, true);

        $scope.$watch('ngModel', (newVal, oldVal) => {
          if (newVal != undefined && newVal.length >= 0 && newVal != oldVal) {
            if (typeof (newVal[0]) == "number") {
              $scope.ngModel = newVal.map(item => item.toString());
            } else {
              setTimeout(function () {
                $($element).selectpicker("refresh");
              }, 200)
            }
          }
        });
      }
    }
  });
})();

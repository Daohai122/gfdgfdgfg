(function () {
  "use strict";

  angular.module("MyApp").directive('datePicker', function () {
    return {
      restrict: 'A',
      scope: {
        selectTime: '@',
        typeTime: '@',
        ngModel: '=',
        name: "@",
        sitenRequire: "@?",
        validation: "=?",
        sitenLarger: "@?",
        noTime: '@',
        defaultDate: '@',
        tooltip: '@',
        futureDate: '@',
        startDate: '@',
        update: '=?',
      },
      template: '<input type="text" class="form-control" name={{name}} readonly="true" size="16" filter="{{name}}" style="height: 36px !important;">' +
        '<div class="input-group-addon datetimepicker">' +
        '<span class="glyphicon glyphicon-th"></span>' +
        '</div>',
      link: function ($scope, $element) {
        var check = false;
        var config = {
          todayHighlight: !0,
          autoclose: true,
          format: 'dd/mm/yyyy',
          clearBtn: true,
          orientation: "bottom",
          language: $scope.$root.currentLanguage,
        }
        $.fn.datepicker.dates['vi'] = {
            days:["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"],
            daysShort:["CN","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"],
            daysMin:["CN","T2","T3","T4","T5","T6","T7"],
            months:["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"],
            monthsShort:["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"],
            today:"Hôm nay",
            clear:"Xóa",
            format:"dd/mm/yyyy",
            weekStart: 0
        };
        if ($scope.futureDate) {
          config.endDate = $scope.futureDate;
        }
        $($element).datepicker(config).on("changeDate", function (e) {
          var d = new Date(e.date);
          var utcd = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

          // obtain local UTC offset and convert to msec
          // var localOffset = d.getTimezoneOffset() * 60000;
          var newdate = e.date;
          if (!check) {
            newdate = new Date(utcd);
          }

          $scope.ngModel = newdate.getFullYear() +'-'+(newdate.getMonth()+1) + '-' + newdate.getDate();

          
          _.defer(function(){ 
            $scope.$apply(); 
          });

          return $scope.ngModel
        }.bind({ element: $element, scope: $scope }));
        $scope.$watch("ngModel",(newValue,oldValue) => {
          if(newValue!= undefined && newValue!=oldValue){
            $($element).datepicker('setDate', new Date($scope.ngModel));
          }
        });

        $scope.$watch('update', (newVal, oldVal) => {
          if (newVal != undefined) {
            setTimeout(function () {
              if ($scope.startDate) {
                $($element).datepicker('setStartDate', new Date(newVal))
              }
            }, 200)
          }
        }, true);

        setTimeout(function () {
          if ($scope.ngModel != undefined) {
            $($element).datepicker('setDate', new Date($scope.ngModel));
          }
        }, 800);
        $scope.goToList =() => {
          $state.go('admin.project.list');
        }
      }
    }
  });
})();



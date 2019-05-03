(function () {
    "use strict";
    angular.module("MyApp").directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        scope:{
            ngModel:"="
        },
        link: function ($scope, elem, attrs, ctrl) {
            // if (!ctrl) return;

            // ctrl.$formatters.unshift(function (a) {
            //     return formatValue($scope.ngModel);
            //     // return $filter(attrs.format)(ctrl.$modelValue)
            // });

            // $(elem).val(formatValue($scope.ngModel))


        

           var scope = $scope;
            // $(elem).bind('blur', function(event) {
            //     var plainNumber = parseFloat($(elem).val().replace(/[^0-9._-]/g, '')) || 0;

            //     var displayValue = formatValue(plainNumber)

            //     debugger;
            //     $(elem).val(displayValue);
            //     scope.ngModel = plainNumber;

            //     // $(elem).val($filter(attrs.format)(plainNumber));
            // });

            function formatValue(number){
                return number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            }

            $scope.$watch("ngModel",function(newValue, oldValue){
                if(newValue){
                    newValue = parseFloat(newValue.toString().replace(/[^0-9._-]/g, '')) || undefined;
                }

                if(oldValue){
                    oldValue = parseFloat(oldValue.toString().replace(/[^0-9._-]/g, '')) || undefined;
                }
               
                if(newValue!=oldValue){
                    var displayValue = formatValue(newValue);
                    $scope.ngModel = newValue;
                    setTimeout(() => {
                        $(elem).val(displayValue);
                    }, 100);
                    
                    // $(elem).val();
                }
            })
        }
    };
}])
})();
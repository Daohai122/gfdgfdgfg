(function () {
  "use strict";
  angular.module("MyApp").directive('siSelect', function ($compile, $q, ApiService) {

    return {
      restrict: 'A',
      scope: {
        search: '@',
        width: '@',
        boostrapClass: '@',
        placeholder: '@',
        clear: '@',
        getData: '&',
        textKey: '@',
        selectall: '@',
        ngModel: '=?',
        templateResult: '=',
        level: '@',
        multiple: '@',
        select: '&',
        unselect: '&',
        old_values: '=',
        dataSelected: '<',
        valueKey: '@',
        bindData: "=",
        templateSelection: '=',
        update: '=?',
        selectallvalue: '@',
        unbind: '@',
        allowNull: '@'
      },
      template: '<select class="form-control"><option value=""></option></select>',
      link: function ($scope, $element, $attrs) {

        var unbind;
        var init = function () {
          if ($scope.bindData) {
            let data = [];
            $.each($scope.bindData, (i, v) => {
              data.push(v[$scope.valueKey]);
            });
            $scope.old = data;
          } else {
            $scope.old = [];
          }

          $scope.getData().then(function (data) {

            // option select2 default
            var optDefault = {};
            optDefault.minimumResultsForSearch = Infinity; // hidding search box
            optDefault.allowClear = false;

            // option select2 custom
            var optCustom = {

            };

            if ($scope.search != undefined) {
              optCustom.minimumResultsForSearch = true;
            }

            // conver key field to text
            if ($scope.textKey != undefined) {
              optCustom.data = data.map(function (item) {
                item.text = item[$scope.textKey];
                item.id = item[$scope.valueKey];
                if (item.id == undefined) item.id = "";
                return item;
              });
            } else if ($scope.level != undefined) {
              optCustom.data = data.map(function (item) {
                var level = "";
                if ($scope.level) {
                  switch (item.level) {
                    case 0:
                      level = ""
                      break;
                    case 1:
                      level = "----"
                      break;
                    case 2:
                      level = "---------";
                      break;
                    default:
                      level = "";
                  }
                  item.text = level + myApp.trimContent(item.name);
                } else {
                  item.text = myApp.trimContent(item.name);
                }
                return item;
              });
            } else {
              optCustom.data = data.map(function (item) {
                item.text = item.name;
                return item;
              });
            }
            if ($scope.clear != undefined) {
              optCustom.allowClear = true;
            }

            var all = [{
              id: ""
            }];

            if ($scope.selectall != undefined) {
              $($element).find('option:first').remove();
              if ($scope.selectallvalue) {
                all[0].name = $scope.selectallvalue;
              } else {
                all[0].name = "Tất cả";
              }
              all[0].id = "all";
            } else {
              let placeholder = "Chọn";
              if ($scope.placeholder != undefined) {
                placeholder = $scope.placeholder;
              }

              optCustom.placeholder = placeholder;
              all[0] = {
                id: "",
                text: placeholder
              }
            }

            //merge option default with custom
            optCustom.data = all.concat(optCustom.data);

            // Merge OptCustom into OptDefault, recursively
            var option = $.extend(true, optDefault, optCustom);
            option.escapeMarkup = function (markup) {
              //var start = markup.lastIndexOf('<script>');
              //var end = markup.lastIndexOf('</script>');
              //if (start != -1 && end != -1) {
              //  if ((start - end) < 0) {
              //    markup = markup.replace(/<script>/g, '');
              //    markup = markup.replace(/<\/script >/g, '');
              //  }
              //}
              return markup;
            }
            if ($scope.templateResult != undefined) {
              option.templateResult = $scope.templateResult;
            }
            if ($scope.templateSelection != undefined) {

              option.templateSelection = $scope.templateSelection;
            }

            option.language = {
              noResults: function (params) {
                return "Không có kết quả nào!";
              }
            }

            if ($scope.multiple) {
              option.closeOnSelect = false;
            }

            if ($scope.boostrapClass) {
              option.theme = "bootstrap";
              option.containerCssClass = ':all:';
            }

            if ($scope.width) {
              option.width = $scope.width;
            }

            $($element).select2(option).on('change', function (data) {
              if ($scope.multiple) {
                let scope = this.scope;
                let newVal = $($element).val();
                if (newVal == null) {
                  newVal = [];
                }
                if (newVal.length > 0) newVal.sort();
                let oldVal = scope.old;
                if (oldVal.length > 0) {
                  oldVal = scope.old.toString().split(",");
                  oldVal.sort();
                }
                if (oldVal == null) {
                  oldVal = [];
                }
                let addValue = $(newVal).not(oldVal).get()[0];
                let subValue = $(oldVal).not(newVal).get()[0];


                if (newVal.length >= oldVal.length) {
                  if (addValue)
                    $scope.select({
                      id: parseInt(addValue)
                    });
                }
                if (oldVal.length > newVal.length) {
                  $scope.unselect({
                    id: subValue
                  });
                }
                $scope.ngModel = newVal;
                $scope.$apply();
              } else {
                $scope.ngModel = $($element).val();
                $scope.$apply();
              }
            }.bind({
              scope: $scope
            }));

            // setTimeout(() => {
            //   if ($scope.bindData) {
            //     let data = [];
            //     $.each($scope.bindData, (i, v) => {
            //       data.push(v[$scope.valueKey]);
            //     })
            //     $($element).val(data).trigger('change');
            //   }
            // }, 1000);

            // $($element).on('select2:select', (event) => {
            //   var value = $($element).select2('val');
            //   if ($($element).val() != "") {

            //     $scope.old = $($element).val();
            //   }
            //   event.preventDefault();
            // });

            // $($element).on('select2:unselecting', (data, choice) => {
            //   if ($($element).val() != "")
            //     $scope.old = $($element).val();
            //   event.preventDefault();
            // });

            // if ($scope.ngModel != undefined) {
            //   setTimeout(function () {
            //     if (Array.isArray($scope.ngModel)) {
            //       $($element).val($scope.ngModel).trigger('change');
            //     } else {
            //       $($element).val($scope.ngModel + '').trigger('change');
            //     }

            //   }, 400);
            // } else {
            // }

            unbind = $scope.$watch('ngModel', function (newVal, oldVal) {
              if (newVal != undefined) {
                setTimeout(function () {
                  if ($.isArray(newVal)) {
                    if (oldVal != undefined) {
                      if (newVal.toString() != oldVal.toString()) {
                        $($element).val(newVal).trigger('change');
                      }
                    } else {
                      $($element).val(newVal).trigger('change');
                    }

                  } else if (!$.isArray(newVal) && newVal != null && newVal != '') {
                    $($element).val(newVal + '').trigger('change');
                  }

                  if (newVal != '') {
                    var name = $($element).attr('name');
                    $($element).siblings('.help-block.help-block-error').remove();
                    $($element).closest('.form-group').removeClass('has-error');
                  }

                }, 100);
              } else if (newVal == undefined && oldVal != undefined) {
                $($element).find('option:first').remove();
              }
            }, true);

            // $($element).find('option:first').remove();
          });

        }

        // set up select2 lần đầu
        init();

        // relaod select 2 khi data thay đổi
        $scope.$watch('update', (newVal, oldVal) => {
          if (newVal != undefined && newVal != oldVal) {
            if (unbind != undefined) {
              unbind();
            }
            $($element).empty();
            init();
          }
        }, true);

      }
    }
  });
})();

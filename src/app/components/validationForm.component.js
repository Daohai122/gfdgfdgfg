(function () {
  "use strict";

  angular.module("MyApp").directive('validationForm', function () {
    return {
      restrict: 'A',
      scope: {
        validationForm: "=?",
        submitFunction: "&",
        onEnter: "&"
      },
      link: function ($scope, $element, APP_CONFIG) {
        var countInput = 0;
        var validation = {
          rules: {},
          messages: {}
        }

        //Cấu hình validation cho form dựa vào attributes của các input, select, textarea
        setTimeout(function () {
          $($element).attr('novalidate', ' ');
          $($element).find(".form-group").find("input, select, textarea, datepicker").each(function (i, e) {
            if ($(e).attr("type") == "text") {
              $(e).val().trim();
            }

            var name = e.getAttribute("name");
            if (name == null) {
              name = e.getAttribute("ng-model");
              if (name == null) {
                name = "nameInput" + countInput;
                $(e).attr("name", name);
              } else {
                $(e).attr("name", name);
              }
            }

            if (!validation.rules[name]) {
              validation.rules[name] = {};
            }
            if (!validation.messages[name]) {
              validation.messages[name] = {};
            }

            if (e.hasAttribute("maxlength")) {
              validation.rules[name].maxlength = parseInt(e.getAttribute("maxlength"));
              validation.messages[name].maxlength = "Không được quá " + e.getAttribute("maxlength") + " kí tự.";
            }

            if (e.hasAttribute("minlength")) {
              validation.rules[name].minlength = e.getAttribute("minlength");
              validation.messages[name].minlength = "Không được nhỏ hơn " + e.getAttribute("minlength") + " kí tự.";
            }


            if (e.hasAttribute('email')) {
              validation.rules[name]['email'] = true;
              validation.messages[name]['email'] = "Email chưa đúng định dạng."
            }

            if (e.hasAttribute('phone')) {
              validation.rules[name].phone = true;
              validation.messages[name].phone = "Số điện thoại không đúng."
            }

            if (e.hasAttribute("required-summernote")) {
              validation.rules[name]['required-summernote'] = "";
              validation.messages[name]['required-summernote'] = "Vui lòng nhập giá trị.";
            }

            if (e.hasAttribute("pattern")) {
              validation.rules[name].pattern = e.getAttribute('pattern');
              validation.messages[name].pattern = "Giá trị không hợp lệ.";
            }

            if (e.hasAttribute('min')) {
              validation.rules[name].min = parseInt(e.getAttribute("min"));
              validation.messages[name].min = "Không được nhỏ hơn " + e.getAttribute('min');
            }

            if (e.hasAttribute('max')) {
              validation.rules[name].max = parseInt(e.getAttribute("max"));
              validation.messages[name].max = "Không được lớn hơn " + e.getAttribute('max');
            }

            if (e.hasAttribute("required")) {
              validation.rules[name].required = true;
              validation.messages[name].required = "Vui lòng nhập giá trị.";
            }
          });
          if (!APP_CONFIG.fnValidate) APP_CONFIG.fnValidate = [];
          $scope.validator = APP_CONFIG.fnValidate[$($element).attr("id")] = validateForm($element, validation);
          $scope.validationForm = $scope.validator;

          $scope.$apply();

          $scope.resetForm = function reset() {
            $($element).find('.has-error').removeClass('has-error');
            $scope.validator.resetForm();
          }

          //enter datepicker don't validate form
          $($element).on('keypress', 'input', function (e) {
            if (e.keyCode == 13) {
              if ($(this).hasClass("date-picker")) {
                e.preventDefault();
                return;
              }
              $scope.onEnter();
            }
          });
          // btn 
          $($element).delegate("[button-reset]", "click", function (e) {
            $scope.resetForm();
          });
          // btn tạo
          $($element).delegate("[button-submit]", "click", function (e) {
            if ($scope.validator.form()) {
              $scope.submitFunction();
            } else {
              $scope.validator.focusInvalid();
              // toastr.info("Một số trường không đúng hoặc đang để trống!");
            }
          });
        }, 500);

        let validateForm = function (element, config) {
          var defaultConfig = {
            errorElement: 'div', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: true, // do not focus the last invalid input
            //ignore: ".ignore", // validate all fields including form hidden input
            ignore: ":input:hidden.form-control,textarea:hidden.form-control,.note-editable",
            errorPlacement: function (error, element) {
              if (element.closest(".form-group").find(".input-group").length > 0) {
                error.insertAfter(element.closest(".form-group").find(".input-group"));
              } else if (element.is(':checkbox')) {
                error.insertAfter(element.closest(".md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline"));
              } else if (element.is(':radio')) {
                error.insertAfter(element.closest(".row.m-margin-right-0.m-margin-left-0"));
              } else if (element.is('select')) {
                if($(element).attr("si-selectpicker") != undefined){
                  error.insertAfter(element.closest(".form-group").find(".btn.dropdown-toggle.bs-placeholder.btn-light"));
                } else {
                  error.insertAfter(element.closest(".form-group").find("select"));
                }
              } else if (element.is('textarea')) {
                if ($(element).attr("summernote") != undefined) {
                  error.insertAfter(element.closest(".form-group").find(".note-editor"));
                } else {
                  error.insertAfter(element);
                }
              } else if (element.is(':file')) {
                error.insertAfter(element.closest(".fileinput"));
              } else {
                error.insertAfter(element); // for other inputs, just perform default behavior
              }

            },
            highlight: function (element, errorClass, validClass) {
              $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            unhighlight: function (element, errorClass, validClass) { // revert the change done by hightlight
              $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
              $(element).closest('.form-group').find('.help-block.help-block-error').remove();
            },
            submitHandler: function (form) {
              //success1.show();
              //error1.hide();
            },
            debug: true

          };

          return $(element).validate($.extend({}, defaultConfig, config));
        }

      }
    }
  });
})();

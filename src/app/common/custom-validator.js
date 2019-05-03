jQuery.validator.addClassRules("required", {

  required: true,
  normalizer: function (value) {
    return $.trim(value);
  }
});
jQuery.validator.addMethod("phone", function (value, element) {

  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^\+*\d{1,20}$/.test(value);
}, 'Please enter a valid phone number.');

jQuery.validator.addMethod("urlLink", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value);
}, 'Please enter a valid URL.');

jQuery.validator.addMethod("expireDate_larger_effectDate", function (value, element, param) {

  var elemTime = $(element).val().split('/');
  var effectTime = $('#' + param).find('input').val().split('/');
  return parseInt(elemTime[0]) >= parseInt(effectTime[0]) && parseInt(elemTime[1]) >= parseInt(effectTime[1]) && parseInt(elemTime[2]) >= parseInt(effectTime[2]);
}, 'Expired date should be greater or equal than  Effect date.');

jQuery.validator.addMethod("min", function (value, element, param) {
  value = Number(value.replace(/,/g,''));
  // if (isNaN(value) || !value) {
  //   return true;
  // }
  return value >= param;
}, 'Expired date should be greater or equal than  Effect date.');

jQuery.validator.addMethod("imageLink", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /(https?:)?\/?[^'"<>]+?\.(jpg|jpeg|gif|png)/.test(value);
}, 'Please enter a valid image URL.');


// chweck ký tự đặc biệt
jQuery.validator.addMethod("checkScript", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^[\u00BF-\u1FFF\u2C00-\uD7FF\w\@\-_\+\s]*$/g.test(value); // check
}, 'Chứa ký tự không hợp lệ');
jQuery.validator.addMethod("coupon", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^[A0-Z9]*$/g.test(value); // check
}, 'Chấp nhận ký tự in hoa và chữ số');
$.validator.addMethod("greaterThan",
  function (value, element, param) {
    var $otherElement = $(param);
    return parseInt(value, 10) > parseInt($otherElement.val(), 10);
  });
$.validator.addMethod("smallerThan", function (value, element, param) {
  param = param.split(",");
  var $otherElement = $(param[0]);
  if (value != "" && $otherElement.val() != "")
    return parseInt(value, 10) <= parseInt($otherElement.val(), 10);
  else
    return true;
});
jQuery.validator.addMethod("email", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/g.test($.trim(value)); // check
}, 'Email chưa đúng định dạng');
jQuery.validator.addMethod("required", function (value, element) {

  if(Array.isArray(value)){
    return value.length;
  } else if(value == null) {
    return false
  }
   else{
    return value.trim() == '' ? false : true;
  }
});
jQuery.validator.addClassRules("required", {
  required: true,
  normalizer: function (value) {
    return $.trim(value);
  }
});
jQuery.validator.addMethod("phone", function (value, element) {

  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^\+*\d{1,20}$/.test($.trim(value));
}, 'Please enter a valid phone number.');

//jQuery.validator.addMethod("intCheck", function (value, element) {
//    return this.optional(element) || !isNaN(value) && (parseFloat(value) === parseInt(value, 10));

//}, 'Please enter a integer value.');
jQuery.validator.addMethod("length", function (value, element) {

  return this.optional(element) || $.trim(value).length === parseInt(element.getAttribute("siten-length"));

}, 'invalid');
jQuery.validator.addMethod("floatCheck", function (value, element) {
  return this.optional(element) || /^[- +]?[\d .]+$/.test(value);

}, 'Please enter a float value.');
jQuery.validator.addMethod("urlLink", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value);
}, 'Please enter a valid URL.');

jQuery.validator.addMethod("expireDate_larger_effectDate", function (value, element, param) {

  // var elemTime = $(element).val().split('/');
  // var effectTime = $('#' + param).find('input').val().split('/');
  // var flag = false;
  if ($('#' + param).find('input').val() == '') {
    return true;
  }
  // if (parseInt(elemTime[0]) >= parseInt(effectTime[0])) {
  //   if (parseInt(elemTime[1]) >= parseInt(effectTime[1])) {
  //     flag = true;
  //     if (parseInt(elemTime[2]) >= parseInt(effectTime[2])) {
  //       flag = true;
  //     } else {
  //       flag = false;
  //     }
  //   } else {
  //     flag = false;
  //     if (parseInt(elemTime[2]) > parseInt(effectTime[2])) {
  //       flag = true;
  //     } else {
  //       flag = false;
  //     }
  //   }
  // } else {
  //   if (parseInt(elemTime[1]) > parseInt(effectTime[1])) {
  //     flag = true;
  //     if (parseInt(elemTime[2]) >= parseInt(effectTime[2])) {
  //       flag = true;
  //     } else {
  //       flag = false;
  //     }
  //   } else {
  //     flag = false;
  //     if (parseInt(elemTime[2]) > parseInt(effectTime[2])) {
  //       flag = true;
  //     } else {
  //       flag = false;
  //     }
  //   }
  // }

  var timeFirst = $(element).val();
  var effectTimeF = $('#' + param).find('input').val();
  var time, effectTime;

  if (timeFirst.indexOf(':') == -1) {
    timeFirst = timeFirst.split('/');
    time = Date.parse(new Date(timeFirst[2] + '/' + timeFirst[1] + '/' + timeFirst[0]));
  } else {
    let a = timeFirst.split('/');
    let b = a[2].split(' ');
    let c = b[1].split(':')
    time = Date.parse(new Date(b[0], a[1], a[0], c[0], c[1]));
  }
  if (effectTimeF.indexOf(':') == -1) {
    effectTimeF = effectTimeF.split('/');
    effectTime = Date.parse(new Date(effectTimeF[2] + '/' + effectTimeF[1] + '/' + effectTimeF[0]));
  } else {
    let a = effectTimeF.split('/');
    let b = a[2].split(' ');
    let c = b[1].split(':')
    effectTime = Date.parse(new Date(b[0], a[1], a[0], c[0], c[1]));

  }

  return effectTime <= time;
}, 'Expired date should be greater or equal than  Effect date.');


jQuery.validator.addMethod("imageLink", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /(https?:)?\/?[^'"<>]+?\.(jpg|jpeg|gif|png)/.test(value);
}, 'Please enter a valid image URL.');


// Add validate method required select 2
jQuery.validator.addMethod("requiredSelect2", function (value, element, arg) {
  if (value == '' || value == null) {
    return false;
  } else if ($.isArray(value) && value.length == 0) {
    return false
  }
  return true;
}, "Bạn phải chọn danh mục.");

// chweck ký tự đặc biệt
jQuery.validator.addMethod("checkScript", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^[\u00BF-\u1FFF\u2C00-\uD7FF\w\@\-_\+\s]*$/g.test(value); // check
}, 'Chứa ký tự không hợp lệ');
jQuery.validator.addMethod("coupon", function (value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional(element) || /^[A0-Z9]*$/g.test(value); // check
}, 'Chấp nhận ký tự in hoa và chữ số');
$.validator.addMethod("greaterThan",
  function (value, element, param) {
    var $otherElement = $(param);
    return parseInt(value, 10) > parseInt($otherElement.val(), 10);
  });
$.validator.addMethod("smallerThan",

  function (value, element, param) {
    param = param.split(",");
    var $otherElement = $(param[0]);
    if (value != "" && $otherElement.val() != "")
      return parseInt(value, 10) <= parseInt($otherElement.val(), 10);
    else
      return true;
  });

jQuery.validator.addMethod("intCheck", function (value, element) {
  //return this.optional(element) || !isNaN(value) && (parseFloat(value) === parseInt(value, 10));
  return this.optional(element) || /^[- +]?[\d]+$/.test(value);
}, 'Please enter a integer value.');

//jQuery.validator.addMethod("required", function (value, element) {

//  return $(element).val().trim() == '' ? false : true;
//}, 'Vui lòng nhập giá trị');

jQuery.validator.addMethod("smallerThanToday", function (value, element) {
  var today = new Date();
  var millisecondsTimeToday = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  var dateParts = value.split("/");
  var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  var millisecondsTimeInput = Date.parse(dateObject);
  return millisecondsTimeInput >= millisecondsTimeToday ? false : true;
}, 'Enter the date smaller than today');

jQuery.validator.addMethod("requiredUpload", function (value, element, arg) {
  return value != arg ? false : true;
}, 'Enter not enough files!');
// Add validate method required summernot
jQuery.validator.addMethod("required-summernote", function (value, element) {
  return checkTrimString(value);
}, "Bạn phải nhập giá trị");

jQuery.validator.addMethod("required-select", function (value, element) {
  return checkTrimString(value);
}, "Bạn phải nhập giá trị");

// function validation textarea
function checkTrimString(value) {

  if ($.trim(value) != '') {
    if (value != '<p><br></p>') {
      var arrText = value.split('<');
      var inputText = '';

      $.each(arrText, function (index, value) {

        if (value.search('>') != -1) {
          inputText += value.split('>')[1];
        } else {
          inputText += value;
        }
      });

      inputText = $.trim(inputText.replace(/<br>|&nbsp;|<p><br><(\/)p>|<p>|<(\/)p>/g, ''));

      if (inputText == "") {

        return false;
      } else {

        return true;
      }
    }
  } else {
    return false;
  }
}
// min price
jQuery.validator.addMethod("minprice", function (value, element, arg) {

  return Number(value.replace(/,/g, '')) == 0 || Number(value.replace(/,/g, '')) >= 1000 || $.trim(value) != '';
}, "Bạn phải nhập phải bằng 0 hoặc lớn hơn 1000");

jQuery.validator.addMethod("maxprice", function (value, element, arg) {
  return Number(value.replace(/,/g, '')) < 1000000000;
}, "Bạn phải nhập giá trị nhỏ hơn 1000000000");

jQuery.validator.addMethod("lessThan", function (value, element, arg) {
  if ($('#' + arg).children('input').val() == '') {
    return true;
  } else {

    var value = Number(value.replace(/,/g, ''));
    var valCheck = Number($('#' + arg).children('input').val().replace(/,/g, ''));
    if (value > valCheck) {
      return false;
    } else {
      return true;
    }
  }

}, "Giá trị nhập chưa hợp lệ");

(function () {
    "use strict";
    angular.module("MyApp").directive('filebase64', function ($compile, $q,ApiService) {
      return {
        restrict: 'E',
        scope: {
          ngModel: '=',
          ngSrc: '@',
          refid: '@'
        },
        template: 
        '<div class="custom-file">'+
				'<input type="file" class="custom-file-input" accept="image/png,image/jpg,image/jpeg">'+
				'<label class="custom-file-label selected" ></label>'+
        '</div>'+
        '<div style="width:100%; max-height:200px; text-align:center"><img style="display:none;max-height:200px" src="" width="auto" /><div/>',
        
        replace: false,
        link: function ($scope, $element, $attrs) {
          var apiUrl = GLOBAL_CONFIG.API_URL;
          if ($scope.ngSrc) {
            $element.find('img').attr('src', apiUrl + $scope.ngSrc);
            $element.find('img').show();
          }
  
          $element.find('.btn').click(function () {
            $element.find('input').click();
          });
  
          $scope.$watch('ngModel', function (newVal, oldVal) {
            if (newVal) {
            
              if (newVal == null) {
                $element.find('img').attr('style','display:none');
              } else {
                $element.find('img').attr('src', apiUrl + newVal);
                $element.find('img').show();
              }
            }
          
            
          });
  
          $element.find('input').change(function () {
            var dataImage = {};
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function () {
              dataImage.base64String = reader.result.split(',')[1];
              dataImage.fileName = file.name;
              ApiService.POST("files/UploadFileBase64",dataImage).then(function (res) {
                $element.find('img').show();
                $element.find('img').attr('src', GLOBAL_CONFIG.UPLOAD+res.url);
                $scope.ngModel = res.url;
              });
  
            };

            reader.readAsDataURL(file);
          });
        }
      }
    });
  })();
  
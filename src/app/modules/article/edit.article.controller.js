(function () {
  "use strict";
  angular
  .module("MyApp")
  .controller("Edit.Article.Controller", function ($rootScope,$stateParams, $state, $scope, ApiService, OptionService) {
    $scope.$on("$viewContentLoaded", function () {
      $scope.getCategory();
    });
    $scope.dataArticle;
    $scope.dataCategories;
      //   $scope.getCategory();
      $scope.getArticle = function () {
        ApiService.GET("articles/" + $stateParams.id).then(res => {
          $scope.dataArticle = res;
          $scope.dataArticle.categoryId = $scope.dataArticle.categoryId.toString();
          $scope.dataArticle.language = $scope.dataArticle.language.toString();
          if($scope.dataArticle.allowedUserTypes && $scope.dataArticle.allowedUserTypes.length>0) {
            $scope.dataArticle.allowedUserTypes = $scope.dataArticle.allowedUserTypes.map(item => {
              return item.toString();
            });
            
          }
          $scope.formatContent();
          let auth = localStorage.getItem("auth");
          auth = JSON.parse(auth);
          $("#m-dropzone").dropzone({
            url: GLOBAL_CONFIG.API_URL + "/files/UploadFile",
            paramName: "file",
            maxFiles:1,
            clickable: "#upload_img",
            dictDefaultMessage:"",
            acceptedFiles: ".png,.jpg",
            addRemoveLinks: true,
            headers: {
              'Authorization': 'Bearer ' + auth.accessToken
            },
            
            success: function(file,result){
              $scope.dataArticle.featureImageUrl = result.result.url
            },
            init: function () {
              if($scope.dataArticle.featureImageUrl) {
                var mockFile = { name: "img.jpg", size: 12345, type: 'image/jpeg' };       
                this.options.addedfile.call(this, mockFile);
                this.options.thumbnail.call(this, mockFile,  GLOBAL_CONFIG.UPLOAD + $scope.dataArticle.featureImageUrl);
                mockFile.previewElement.classList.add('dz-success');
                mockFile.previewElement.classList.add('dz-complete');
              }
             
              this.on("addedfile", function(file) {
                if (this.files.length > 1)
                this.removeFile(this.files[0]);
                $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
                $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
                $scope.dataArticle.featureImageUrl='';
              });
              this.on("removedfile", function(file) {
                $scope.dataArticle.featureImageUrl='';
              });
              
            }
          })
          $scope.$apply();
        });
      }
      $scope.getCategory = function () {
        return OptionService.getArticleCategory().then(res => {
          $scope.dataCategories =res;
          $scope.$apply();
          $scope.getArticle();
          return res;
          // $scope.$apply();
        });
        
      }
      $scope.statusComment="";
      $scope.checkStatusComment = () => {
        if($scope.dataArticle.categoryId) {
          let statusCategoriesComment;
          for(let i=0; i< $scope.dataCategories.length;i++) {
            if($scope.dataArticle.categoryId == $scope.dataCategories[i].id) {
              statusCategoriesComment = $scope.dataCategories[i].disabled_comment
              break
            }
          }
          if(statusCategoriesComment) {
              $scope.statusComment="Chức năng comment đang tắt.";
            } else if(statusCategoriesComment == false){
              $scope.statusComment="Chức năng comment đang được bật.";
            } else {
              if($scope.dataArticle.disabled_comment) {
                $scope.statusComment="Chức năng comment đang tắt.";
              } else if($scope.dataArticle.disabled_comment == false){
                $scope.statusComment="Chức năng comment đang được bật.";
              }  else {
                $scope.statusComment="Chức năng comment đang được bật.";
              }
            }
        }
      }

      $scope.$watch('dataArticle.disabled_comment',(newValue,oldValue) => {
        // if(newValue!= undefined && newValue!=oldValue){
          $scope.checkStatusComment();
        // }
      });
      $scope.$watch('dataArticle.categoryId',(newValue,oldValue) => {
        if(newValue!= undefined && newValue!=oldValue){
          $scope.checkStatusComment();
        }
      });
      
      $scope.formatContent = () => {
        var htmlContent = $scope.dataArticle.content;
        if (htmlContent.slice(0,34) == '<div style="text-align: justify;">' && htmlContent.slice(-6) == "</div>") {
          htmlContent = htmlContent;
        } else {
          htmlContent = "<div>" + htmlContent + "</div>";
        }
        $('#articleData').html(htmlContent);
        $('#articleData').find('div').css('text-align', 'justify').find('*').not('th, td,p,div,h2,h1,h3,h4,h5,a').css({'max-width': 'unset', 'width': '50%', 'height': 'unset', });

        $('#articleData').find('div').css('text-align', 'justify').find('img,.note-video-clip').css({'display': 'block','margin-left': 'auto',"margin-right": "auto",});
        if($('#articleData').find('.note-video-clip')){
          $('.note-video-clip').each(function() {
            var src = $(this).attr("src");
            if(src.indexOf("https:") == -1) {
              $(this).attr("src", 'https:' + $(this).attr("src"));
            }
            $(this).css({'max-width': '100%','height':"450px"});
          })
        }
        $scope.dataArticle.content =  $('#articleData').html();

      }

      $scope.updateCategories = function () {
        var htmlContent = $scope.dataArticle.content;
        if (htmlContent.slice(0,34) == '<div style="text-align: justify;">' && htmlContent.slice(-6) == "</div>") {
          htmlContent = htmlContent;
        } else {
          htmlContent = "<div>" + htmlContent + "</div>";
        }
        $('#articleData').html(htmlContent);
        $('#articleData').find('div').css('text-align', 'justify').find('*').not('th, td').css({'max-width': 'unset', 'width': '100%', 'height': 'unset'});
        if($('#articleData').find('.note-video-clip')){
          $('.note-video-clip').each(function() {
            var src = $(this).attr("src");
            if(src.indexOf("https:") == -1) {
              $(this).attr("src", 'https:' + $(this).attr("src"));
            }
            $(this).css({'max-width': '100%','height':"600px"});
          })
        }
        
        let data = {
          id: $scope.dataArticle.id,
          title: $scope.dataArticle.title,
          content: $('#articleData').html(),
          featureImageUrl: $scope.dataArticle.featureImageUrl,
          categoryId: $scope.dataArticle.categoryId,
          description:$scope.dataArticle.description,
          allowedUserTypes :$scope.dataArticle.allowedUserTypes,
          disabled_comment:$scope.dataArticle.disabled_comment,
          language:$scope.dataArticle.language,
          isApproved:$scope.dataArticle.isApproved,
          isVisible:$scope.dataArticle.isVisible,
          publishedTime:$scope.dataArticle.publishedTime
        }
        ApiService.PUT('articles', data).then(res => {
          Swal.fire({title: 'Sửa thành công!',type: 'success'}).then(function(result){
            if(result.value){
              $state.go('admin.article.list');
            }
          })
        });
      };
      $scope.goToList = () => {
        $state.go('admin.article.list');
      }
    });
})();

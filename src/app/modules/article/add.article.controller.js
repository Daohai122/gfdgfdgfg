(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Add.Article.Controller", function($rootScope,$state,$scope,ApiService, OptionService) {
          $scope.dataArticle={
            categoryId:'',
            language:'0',
            featureImageUrl:'',
            allowedUserTypes:[],
          }
          $scope.dataCategories;
          let auth = localStorage.getItem("auth");
          auth = JSON.parse(auth);
          $("#m-dropzone").dropzone({
            url: GLOBAL_CONFIG.API_URL+ "files/UploadFile",
            paramName: "file",
            acceptedFiles: ".png,.jpg",
            addRemoveLinks: true,
            clickable: "#upload_img",
            dictDefaultMessage:"",
            maxFiles:1,
            headers: {
                'Authorization': 'Bearer ' + auth.accessToken
            },
            
            success: function(file,result){
              $scope.dataArticle.featureImageUrl = result.result.url
            },
            init: function () {
              this.on("addedfile", function(file) {
                if (this.files.length > 1)
                this.removeFile(this.files[0]);
                // $(".dz-preview.dz-processing.dz-image-preview.dz-complete").remove();
                // $(".dz-preview.dz-success.dz-complete.dz-image-preview").remove();
                $scope.dataArticle.featureImageUrl='';
              });
              this.on("removedfile", function(file) {
                $scope.dataArticle.featureImageUrl='';
              });
            }
          });
          $scope.getCategory =  function() {
            return OptionService.getArticleCategory().then(res => {
                $scope.dataCategories = res;
                $scope.$apply();
                return res;
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

          $scope.getCategory();
          $scope.addCategories = function (){
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
                  $(this).css({'max-width': '100%','height':"450px"});
                })
                }
              let data = {
                  title : $scope.dataArticle.title,
                  content : $('#articleData').html(),
                  featureImageUrl :$scope.dataArticle.featureImageUrl,
                  categoryId :$scope.dataArticle.categoryId,
                  description:$scope.dataArticle.description,
                  allowedUserTypes :$scope.dataArticle.allowedUserTypes,
                  isVisible: true,
                  disabled_comment:$scope.dataArticle.disabled_comment,
                  language:$scope.dataArticle.language,
                  publishedTime:$scope.dataArticle.publishedTime
              }
              ApiService.POST('articles',data).then(res => {
                Swal.fire({title: 'Thêm thành công!',type: 'success'}).then(function(result){
                    if(result.value){
                      $state.go('admin.article.list');
                    }
                  });
              });
          };
          $scope.goToList = () => {
            $state.go('admin.article.list');
          }
      });
  })();
  

(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Comment.New.Controller", function ($rootScope, $state, $scope,ApiService,$compile, $location) {
          $scope.dataComment;
          $scope.idSelect;
          $scope.articleId;
          $scope.titleArticle;
          $scope.dataTreeComment;
          $scope.replyComment={
            parentId:'',
            articleId:''
          }
          $scope.idArticleSelect;
          ApiService.GET('/comments/getComments').then(res => {
            $scope.dataComment = res.data;
            if ($location.$$search.articleId) {
              $scope.viewComment($location.$$search.articleId);
            }
            $scope.$apply();
            $('#table_comment').DataTable({
                destroy:true,
                "searching":false,
                "bLengthChange" : false,
                "ordering": false,
                language: {
                    info: "Hiển thị _START_  đến  _END_ trong tổng số _TOTAL_ bản ghi",
                },
                fnDrawCallback: function (oSettings) {
                    $('[data-toggle="m-tooltip"]').tooltip({
                      placement: "auto"
                    });
                  }
              });
          });

          $scope.deleteComment = (id) => {
              swal.fire({title: "Bạn chắc chắn muốn xóa comment này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true,cancelButtonClass: " btn btn-danger m-btn m-btn--custom",
              type: "warning" }).then(res => {
                if(res.value) {
                    ApiService.DELETE("/comments/" + id).then(res => {
                        $scope.viewComment('null');
                        toastr.success("Xóa comment thành công!");
                    })
                }
              });
              
          }
          $scope.openBoxComment = (id) => {
            $scope.idSelect=id;
          }
          $scope.viewComment =(id) => {
            $scope.idArticleSelect = id;
            if ($scope.articleId != id) {
              if(id!= "null") {
                if ($scope.dataComment.filter(x => x.articleId == id)[0].articleInfo) {
                  $scope.titleArticle = $scope.dataComment.filter(x => x.articleId == id)[0].articleInfo ? $scope.dataComment.filter(x => x.articleId == id)[0].articleInfo.title : '';
                  $scope.articleId = id;
                  $scope.idSelect = $scope.dataComment.filter(x => x.articleId == id)[0].id;
                  $location.search('articleId', id);
                } else {
                  swal.fire({
                    title: 'Bài viết không tồn tại',
                    type: "error"
                  }).then(function(result){
                    if(result.value){
                      $state.go('admin.comment.listNew', {articleId: null});
                    }
                  });
                  return;
                }
              }
              $scope.dataTreeComment=[];
              ApiService.GET('/comments/getTree/'+  $scope.articleId).then(res => {
                  $scope.getArticleDetail();
                  $scope.dataTreeComment = res;
                  if($scope.dataTreeComment.length >0){
                      for(let i=0; i< $scope.dataTreeComment.length; i++) {
                          
                          if($scope.dataTreeComment[i].creationTime){
                              let time = new Date($scope.dataTreeComment[i].creationTime);
                              $scope.dataTreeComment[i].creationTime = (time.getDate().toString().length==1?('0' +time.getDate().toString()):time.getDate()) + '/' + ((time.getMonth() + 1).toString().length == 1?('0'+(time.getMonth() + 1).toString()):(time.getMonth() + 1)) + '/'+ time.getFullYear() + ' ' + time.getHours() +':'+ time.getMinutes();
                          }
                          if($scope.dataTreeComment[i].avatar){
                              $scope.dataTreeComment[i].avatar = GLOBAL_CONFIG.UPLOAD +$scope.dataTreeComment[i].avatar;
                          }
                          if($scope.dataTreeComment[i].children.length > 0){
                              for(let j=0; j< $scope.dataTreeComment[i].children.length; j++){
                                  if($scope.dataTreeComment[i].children[j].avatar){
                                      $scope.dataTreeComment[i].children[j].avatar = GLOBAL_CONFIG.UPLOAD +$scope.dataTreeComment[i].children[j].avatar;
                                  }
                                  let time = new Date($scope.dataTreeComment[i].children[j].creationTime);
                                  $scope.dataTreeComment[i].children[j].creationTime = (time.getDate().toString().length==1?('0' +time.getDate().toString()):time.getDate()) + '/' + ((time.getMonth() + 1).toString().length == 1?('0'+(time.getMonth() + 1).toString()):(time.getMonth() + 1)) + '/'+ time.getFullYear() + ' ' + time.getHours() +':'+ time.getMinutes();
                              }
                          }
                      }
                  }
                  $scope.$apply();
                  if(id!= "null") {
                      $scope.readComment();
                  }
                  
              })
            }
          };
          $scope.getArticleDetail = () => {
            ApiService.GET('articles/' + $scope.articleId).then(res => {
              $scope.articleDetail = res;
              $scope.articleDetail.articleImage = GLOBAL_CONFIG.UPLOAD + $scope.articleDetail.featureImageUrl;
              $scope.$apply();
            })
          }
          // đánh dấu đã đọc
          $scope.readComment = () => {
              let arrayId= new Array;
              if($scope.dataTreeComment) {
                  if($scope.dataTreeComment.length > 0) {
                      for(let i=0; i< $scope.dataTreeComment.length; i++) {
                          arrayId.push( $scope.dataTreeComment[i].id);
                          if($scope.dataTreeComment[i].children && $scope.dataTreeComment[i].children.length>0){
                            for(let j=0; j< $scope.dataTreeComment[i].children.length; j++) {
                                arrayId.push( $scope.dataTreeComment[i].children[j].id);
                            }
                          }
                      }
                    let url="";
                    if(arrayId.length > 0) {
                        for(let i =0; i< arrayId.length; i++) {
                            if(i == arrayId.length - 1){
                                url = url + "lstId="+ arrayId[i];
                            } else {
                                url = url + "lstId="+ arrayId[i] + "&";
                            }
                            
                        }
                    }
                    ApiService.POST("/comments/isRead?" + url).then(res => {}).catch(error => {
                        // swal.fire({title: error.data.result.message, type: "error"});
                    });
                  }
                
              }
              
          }
          $scope.likeComment =(id) => {
            for(let i =0; i< $scope.dataTreeComment.length; i++) {
                if(id == $scope.dataTreeComment[i].id){
                    $scope.dataTreeComment[i].isLiked= true;
                    $scope.dataTreeComment[i].likeCount =  $scope.dataTreeComment[i].likeCount +1;
                }
                if($scope.dataTreeComment[i].children.length>0) {
                    for(let j=0; j< $scope.dataTreeComment[i].children.length; j++){
                        if(id == $scope.dataTreeComment[i].children[j].id){
                            $scope.dataTreeComment[i].children[j].isLiked= true;
                            $scope.dataTreeComment[i].children[j].likeCount =  $scope.dataTreeComment[i].children[j].likeCount +1;
                        }
                    }
                }
            }
            ApiService.POST("/comments/"+id+"/like").then(res => {
                
            });
          }
          $scope.unlikeComment =(id) => {
            for(let i =0; i< $scope.dataTreeComment.length; i++) {
                if(id == $scope.dataTreeComment[i].id){
                    $scope.dataTreeComment[i].isLiked= false;
                    $scope.dataTreeComment[i].likeCount =  $scope.dataTreeComment[i].likeCount -1;
                }
                if($scope.dataTreeComment[i].children.length>0) {
                    for(let j=0; j< $scope.dataTreeComment[i].children.length; j++){
                        if(id == $scope.dataTreeComment[i].children[j].id){
                            $scope.dataTreeComment[i].children[j].likeCount =  $scope.dataTreeComment[i].children[j].likeCount -1
                            $scope.dataTreeComment[i].children[j].isLiked= false;
                        }
                    }
                }
            }
            ApiService.POST("/comments/"+id+"/unlike").then(res => {
                
            });
          }
          $scope.postComment =(id,articleId,children) =>{
            if(children) {
                for(let i =0; i< $scope.dataTreeComment.length; i++) {
                    if($scope.dataTreeComment[i].children.length>0) {
                        for(let j=0; j< $scope.dataTreeComment[i].children.length; j++){
                            if(id == $scope.dataTreeComment[i].children[j].id){
                                $scope.replyComment.parentId= $scope.dataTreeComment[i].id;
                                $scope.replyComment.articleId= $scope.dataTreeComment[i].articleId;
                            }
                        }
                    }
                }
            } else {
                $scope.replyComment.parentId= id;
                $scope.replyComment.articleId= articleId;
            }
            if(!$scope.replyComment.content){
                swal.fire({title:"Bạn chưa nhập nội dung", type:"error"});
                return;
            }
            if($scope.replyComment.content.trim() ==''){
                swal.fire({title:"Bạn chưa nhập nội dung", type:"error"});
                return;
            }
            ApiService.POST("comments",$scope.replyComment).then((res) => {
                swal.fire({title:"Done!", type:"success"});
                $scope.replyComment.content='';
                $scope.viewComment('null');
            });
          }

          $scope.$watchCollection(function(){
              return $state.params.articleId;
          }, function(change){
            if ($scope.articleId && $scope.articleId != change) {
              $scope.viewComment(change);
            }
          });

      });
  })();
  
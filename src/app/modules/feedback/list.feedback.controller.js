(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Feedback.Controller", function(
        $rootScope,
        $state,
        $scope,
        $compile,
        ApiService,
        $location,
      ) {
        $scope.reloadTable=1;
        $scope.dataFeedbacks;
        $scope.dataFeedback;
        $scope.tableConfig = {
          requestUrl: "feedbacks",
          columns: [
            {
              data: null,
              width:"5%",
              title: "STT",
              class: "text-center",
              render: function(data, type, full, meta) {
                return Number(meta.settings._iDisplayStart) + meta.row + 1;
              }
            },
            {
              data: "name",
              width:"10%",
              orderable: true,
              title: "Họ tên",
            },
            {
              data: "phone",
              width:"10%",
              orderable: true,
              title: "Số điện thoại",
            },
            {
              data: "email",
              width:"15%",
              orderable: true,
              title: "Email",
            },
            {
              data: "type",
              width:"10%",
              orderable: true,
              title: "Loại",
              render:(data) => {
                if(data == 1){
                  return "Góp ý";
                }else if(data ==0){
                  return "Phản hồi";
                }
              }
            },
            {
              data: "content",
              width:"25%",
              orderable: true,
              title: "Nội dung",
            },
            {
              data: "creationTime",
              width:"10%",
              orderable: true,
              title: "Thời gian tạo",
              type:   'date',
            },
            {
              data: "isReply",
              width:"5%",
              orderable: true,
              title: 'Trạng thái',
              class:"text-center",
              render: (data, type, full, meta) => {
                let viewVerify = "Đã trả lời " + '<a ng-click="unReplyFeedBack('+full.id+')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Đánh dấu chưa trả lời"><i class="fa fa-times"></i></a>';
                if(!full.isReply) {
                  viewVerify ='<a ng-click="replyFeedBack('+full.id+')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Đánh dấu đã trả lời"><i class="fa fa-check"></i></a>'
                }
                return viewVerify;
              },
              fnCreatedCell: function(celContent, sData) {
                $compile(celContent)($scope);
              }
            },
            {
              data: null,
              orderable: false,
              width:"10%",
              title: "Hành Động",
              class: "text-center",
              render: function(data, type, full, meta) {
                let viewDownload='';
                if(data.fileUpload){
                  viewDownload ='<a ng-click="downloadData('+meta.row+')"  class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Download file"><i class="flaticon-tool-1"></i></a>'
                }
                return (
                  viewDownload+
                    '<a href="javarscipt:;" ng-click="gotoEdit(' +
                    meta.row +
                    ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xem"><i class="fa fa-eye"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteFeedback(' +
                    data.id +
                    ')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
                );
              },
              fnCreatedCell: function(celContent, sData) {
                $compile(celContent)($scope);
              }
            }
          ],
          fnRowCallback: function (nRow, aData, iDisplayIndex) {
            if (!aData.isReply) {
              $(nRow).addClass('highlight');
            }
          },
          fnDrawCallback: function(oSettings) {
            $('[data-toggle="m-tooltip"]').tooltip({
              placement: "auto"
            });
          }
        };
        
        $scope.deleteFeedback = function(id) {
          swal
            .fire({
              title: "Bạn chắc chắn muốn xóa feedback này",
              confirmButtonText: "Xóa",
              cancelButtonText: "Hủy",
              showCancelButton: true
            })
            .then(res => {
              if (res.value) {
                ApiService.DELETE("feedbacks/" + id).then(res => {
                  $scope.reloadTable++;
                  $scope.$apply();
                  toastr.success("Xóa thành công!");
                });
              }
            });
        };
        $scope.replyFeedBack = function(id) {
          ApiService.PUT("feedbacks/SetReply/"+id).then((res) => {
            $scope.reloadTable++;
            $scope.$apply();
            toastr.success("Xong!");
          });
        }
        $scope.unReplyFeedBack = function(id) {
          ApiService.PUT("feedbacks/SetUnReply/"+id).then((res) => {
            $scope.reloadTable++;
            $scope.$apply();
            toastr.success("Xong!");
          });
        }
        $scope.gotoEdit = function(id) {
          $("#modal_feedback").modal("show");
          $scope.dataFeedback = $scope.dataFeedbacks[id];
          // $scope.$apply();
        };
        $scope.downloadData = (id) => {
          $scope.dataFeedback = $scope.dataFeedbacks[id];
          var win = window.open(GLOBAL_CONFIG.UPLOAD + $scope.dataFeedback.fileUpload,"_blank");
          win.focus();
          win.onload = function() { window.open(GLOBAL_CONFIG.UPLOAD + $scope.dataFeedback.fileUpload,"_blank") };
        }
      });
  })();
  
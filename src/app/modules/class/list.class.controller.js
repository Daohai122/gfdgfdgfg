
(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("List.Class.Controller", function ($rootScope,$stateParams, $state, $scope,$compile, ApiService) {
        $scope.reloadTable=1;
        $scope.dataBatches;
        $scope.dataStudyField;
        $scope.getBatches = () => {
            ApiService.GET("batches").then(res => {
                $scope.dataBatches = res.data;
                $scope.$apply();
                $('.m-bootstrap-select').selectpicker('refresh');
            });
        };
        
        $scope.getStudyField = function() {
            return ApiService.GET("studyField").then(res => {
                $scope.dataStudyField = res.data;
                $('.m-bootstrap-select').selectpicker('refresh');
                return res.data;
                // $scope.$apply();
            });
        };
        $scope.getBatches();
        $scope.getStudyField();
        $scope.tableConfig = {
            requestUrl: "classes",
            columns: [
              {
                data:null,
                title:"STT",
                class:"text-center",
                render: function (data, type, full, meta) {
                  return Number(meta.settings._iDisplayStart) + meta.row + 1;
                }
              },
              {
                data: "name",
                orderable: true,
                title: "Mã lớp học",
              },
              {
                data: "batch_name",
                orderable: true,
                title: "Mã khóa học",
              },
    
              {
                data: "from_date",
                orderable: true,
                title: "Thời gian bắt đầu",
                type: "date"
              },
              {
                data: "to_date",
                orderable: true,
                title: "Thời gian kết thúc",
                type: "date"
              },
              {
                data: "field_name",
                orderable: true,
                title: "Ngành học",
                defaultContent:''
              },
              {
                data: "month",
                title: "Thời gian học",
                render: (data) => {
                   if(data) {
                    return data + " tháng";
                   } else {
                    return"";
                   }
                    
                }
              },
              {
                data: null,
                orderable: false,
                title: "Hành Động",
                class:"text-center",
                render: function (data) {
                  return (
                    // '<a href="javarscipt:;" ng-click="gotoEdit('+data.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Sửa"><i class="la la-edit"></i></a>' +
                    '<a href="javascript:;" ng-click="deleteCenter('+data.id+')" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="m-tooltip"  title="" data-original-title="Xóa"><i class="flaticon-delete"></i></a>'
                  );
                },
                fnCreatedCell: function (celContent, sData) {
                  $compile(celContent)($scope);
                }
              }
            ],
            fnDrawCallback: function (oSettings) {
              $('[data-toggle="m-tooltip"]').tooltip({
                placement: "auto"
              });
            }
          };
        $scope.deleteCenter = function(id) {
          $('[data-toggle="m-tooltip"]').tooltip('hide');
            swal.fire({title:"Bạn chắc chắn muốn xóa lớp này?",confirmButtonText:  'Xóa', cancelButtonText:  'Hủy', showCancelButton: true}).then(res => {
                if(res.value) {
                    ApiService.DELETE('classes/'+id).then(res => {
                      $scope.reloadTable++;
                      $scope.$apply();
                      toastr.success("Xóa thành công");
                    });
                };
            });
        };
        $scope.gotoEdit = function(id) {
            $state.go('admin.class.edit',{id:id});
       };
        $scope.goToAdd = function(id) {
             $state.go('admin.class.add');
        };
      });
  })();
  
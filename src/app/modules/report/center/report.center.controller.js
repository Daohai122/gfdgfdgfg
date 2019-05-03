(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.Center.Controller", function(
        $rootScope,
        $stateParams,
        $state,
        $scope,
        $compile,
        ApiService,
        $location,
        
        OptionService
      ) {
        $scope.view = $stateParams.view;
      $scope.reportName = $stateParams.reportName;

      $scope.baseFolder = "/app/modules/report/all/";
      $scope.visibledReport = {};

      if ($scope.reportName) {
        $scope.visibledReport[$scope.reportName] = true;
      }

      $scope.reportConfig = [
        {
          title: "Trung Tâm",
          viewName: "center",
          reports: [{
              title: "Báo cáo tổng hợp theo dõi việc làm",
              reportName: "TrungTam_TongHopTheoGioiViecLam",
              templateUrl: "center/report.job.html"
            },
            {
              title: "Báo cáo tuyển sinh",
              reportName: "TrungTam_BaoCaoTuyenSinh",
              templateUrl: "center/report.admissions.html"
            },
            {
              title: "Báo cáo cựu học viên",
              reportName: "TrungTam_BaoCaoCuuHocVien",
              templateUrl: "center/report.alumni.html"
            }
          ]
        }
      ]

      $scope.dataFilter = {
        center: [],
        batch: [],
        class: [],
        category: [],
        fromAge: null,
        toAge: null,
        gender: null
      };

      $scope.updateRequestParams = function () {
        var query = Object.assign({}, $scope.dataFilter);

        if (query.center) {
          query.center = $scope.dataFilter.center.join(',');
        }
        if (query.batch) {
          query.batch = $scope.dataFilter.batch.join(',');
        }

        if (query.class) {
          query.class = $scope.dataFilter.class.join(',');
        }

        for (var key in query) {
          if (query[key] == "") {
            delete query[key];
          }
        }

        $location.search(query);
        $scope.$apply();
      }
   

      /**
       * Chuyển đổi object filter thành request để gửi lên server
       */
      $scope.getSearchParams = function (filter) {
        return {
          list_center_code: (filter.center && filter.center.length) ? filter.center : null,
          list_batch_id: filter.batch.length ? filter.batch : null,
          list_class_id: filter.class.length ? filter.class : null,
          fromAge: filter.fromAge ? filter.fromAge : null,
          toAge: filter.toAge ? filter.toAge : null,
          gender: filter.gender,
          list_category: filter.category.length ? filter.category : null
        }
      }

      let getFilterDataFromUrl = function () {
        let params = $location.search();
        let query = params;
        if (params.center) {
          query.center = params.center.split(',');
        }
        if (params.batch) {
          query.batch = params.batch.split(',');
        }
        if (params.class) {
          query.class = params.class.split(',');
        }

        if ($scope.dataFilter.center.length > 0) {
          $scope.centerChange();
        }
        if ($scope.dataFilter.batch.length > 0) {
          $scope.batchChange();
        }

        Object.assign($scope.dataFilter, query);
      }
      

      //Lấy giá trị từ trên url
      getFilterDataFromUrl();

      //su ly toan bo phan search
      $scope.$watch('dataFilter.center', function (newVal, oldVal) {
        if (oldVal && newVal != oldVal) {
          $scope.dataFilter.list_batch_id = [];
          $scope.dataFilter.class = [];
        }
      })

      $scope.$watch('dataFilter.batch', function (newVal, oldVal) {
        if (oldVal && newVal != oldVal) {
          $scope.dataFilter.class = [];
        }
      })

      $scope.centerChange = () => {
        $scope.getBatches();
      }
      $scope.batchChange = () => {
        $scope.getClass();
      }

      $scope.getBatches = () => {
        OptionService.getBatch({
          center_codes: $scope.dataFilter.center
        }).then(res => {
          $scope.batch = res;
          $scope.$apply();
        });
      };
      $scope.getCenter = () => {
        OptionService.getCenter().then(res => {
          $scope.center = res;
          $scope.$apply();
        });
      };

      $scope.getClass = function () {
        OptionService.getClass({
          batchIds: $scope.dataFilter.batch
        }).then(res => {
          $scope.class = res;
          $scope.$apply();
        }).catch(error => {
          // swal.fire({
          //   title: "Khóa học này này chưa có lớp học nào!",
          //   type: "error"
          // });
        });
      };

      $scope.changeReportName = function (reportName) {
        $scope.reportName = reportName;
        $scope.visibledReport[reportName] = true;

        $state.go($state.current.name, {
          reportName: reportName,
          view: $scope.view
        }, {
          notify: false
        });
      }

      $scope.changeView = function (view) {
        console.log(view)
        $scope.view = view;
        $state.go($state.current.name, {
          view: view
        }, {
          notify: false
        });
      }

      $scope.toogleSearchFilter = function ($event) {
        if ($scope.viewMode == 'full') {
          $scope.viewMode = "normal";
        } else {
          $scope.viewMode = 'full';
        }
        // $($event.target).closest(".report-view-section").find(".tab-pane.col-md-9").addClass("col-md-12").removeClass("col-md-9");
      }
    });
      
  })();
  
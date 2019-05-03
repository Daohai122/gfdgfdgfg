(function () {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.TacDong.KhaoSatHoanThanh", function (
        $rootScope,
        $stateParams,
        $state,
        $scope,
        $compile,
        ApiService,
        OptionService
      ) {
        $scope.init = function () {
          $scope.getReportData();
          $scope.getCenter();
        }
  
        $scope.dataReport;
        $scope.columns = [];
  
        $scope.getReportData = () => {
          $scope.columns = [
            {key: "center_name",title: "Trung tâm"}, 
            {key: "batch_name",title: "Khóa"},
            {key:"student_count",title:"Tổng sinh viên"},
            {key:"qol1_count",title:"Khảo sát lần 1"},
            {key:"qol1_count",title:"Khảo sát lần 2"},
            {key:"qol1_count",title:"Khảo sát lần 3"}];
          let query = $scope.getSearchParams($scope.dataFilter);
  
        //   let data = [];
          ApiService.POST("reports/TacDong_CaiThienCuocSong", query).then(res => {
            
            $scope.dataReport = res;
            $scope.$apply();
            // $scope.drawChartMale();
            const ps = new PerfectScrollbar('.scroll_table', { });

            $scope.updateRequestParams(query);
          });
        }
      });
  
  })();
  
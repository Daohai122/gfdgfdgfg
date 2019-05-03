(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Hocviencoviec.Controller", function(
        $rootScope,
        $stateParams,
        $state,
        $scope,
        $element,
        $compile,
        ApiService,
      OptionService
      ) {
        $scope.init = () => {
          $scope.getReportData();
          $scope.getCenter();
        };
        $scope.dataPice=[{category:"Khác"}, {category:"Số HV có vệc làm trong 6 tháng"}];
        $scope.dataReport;
        $scope.columns = [{key:"batch_name", title: 'Khóa'}, {key:"has_job_count", title: 'Tổng số'}, {key:"male_count", title:"Nữ"},{key:"female_count", title:"Nam"}];
        let data={};
        $scope.getReportData = () => {
          let query = $scope.getSearchParams($scope.dataFilter);
          let data = {};
          ApiService.POST("/reports/KetQua_HocVienCoViecLamTrong6Thang", query).then(res => {
            let studentHasJob=0;
            let studentNoJob=0;
            res.forEach(item => {
              studentHasJob += item.has_job_count;
              studentNoJob += (item.student_count - item.has_job_count);
              if(data[item.center_name]){
                data[item.center_name].items.push(item);
              } else {
                data[item.center_name] = {
                  center_name: item.center_name,
                  items: [item]
                }
              }
            });
            $scope.dataPice[0].value = studentNoJob;
            $scope.dataPice[1].value = studentHasJob;
            $scope.dataReport = data;
            $scope.$apply();
            $scope.drawPiceMale(res);
            $scope.updateRequestParams(query);
          });
        };
        let chart;
        $scope.drawPiceMale =(dataPice) => {
          if(dataPice){
            var chartContainer = $($element).find("#chartPice")[0];
            chart = am4core.create(chartContainer, am4charts.PieChart3D);
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.legend = new am4charts.Legend();

            chart.data = $scope.dataPice;
            var series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "value";
            series.dataFields.category = "category"; 
          } else {
            if(chart){
              chart=null;
            }
          }
        }
      });
      
  })();
  
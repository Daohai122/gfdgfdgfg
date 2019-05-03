
(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.DoanhNghiep.SoLuongDoanhNghiep", function (
      $rootScope,
      $stateParams,
      $state,
      $scope,
      $compile,
      ApiService,
      $element,
      OptionService
    ) {
        $scope.init = function () {
          $scope.getReportData();
          $scope.getCenter();
        }

        $scope.dataReport;
        let chart;

        $scope.getReportData = () => {
          let query = $scope.getSearchParams($scope.dataFilter);
          ApiService.POST("reports/ReportCompany/DoanhNghiep_SoLuongDoanhNghiep", query).then(res => {
            let dataPice = res;
            $scope.drawPiceMale(dataPice);
            $scope.dataReport = res;
            let dataObj={
              center_name:"Tổng số",
              total_company:0,
              small:0,
              medium:0,
              large:0
            };
            $scope.dataReport.map(item=> {
              dataObj.total_company =dataObj.total_company + item.total_company;
              dataObj.small =dataObj.small + item.small;
              dataObj.medium =dataObj.medium + item.medium;
              dataObj.large =dataObj.large + item.large;
            });
            dataObj.small = ((dataObj.small/dataObj.total_company)*100).toFixed(2) +" %";
            dataObj.medium = ((dataObj.medium/dataObj.total_company)*100).toFixed(2) +" %";
            dataObj.large = ((dataObj.large/dataObj.total_company)*100).toFixed(2) +" %";
            $scope.dataReport.push(dataObj);
            $scope.$apply();
            $scope.updateRequestParams(query);
          });
        }
        
        $scope.drawPiceMale =(dataPice) => {
          if(dataPice && dataPice.length > 0){
            let data={small:0,
              medium:0,
              large:0};
              dataPice.map(item => {
              data.small =data.small + item.small;
              data.medium =data.medium + item.medium;
              data.large =data.large + item.large;
            });
            var chartContainer = $($element).find("#chartPice")[0];
            chart = am4core.create(chartContainer, am4charts.PieChart3D);
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.legend = new am4charts.Legend();

            chart.data = [
              {
                category: "Nhỏ",
                value: data.small ,
              },
              {
                category: "Vừa",
                value: data.medium ,
              },
              {
                category: "Lớn",
                value: data.large,
              },
            ];
            var series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "value";
            series.dataFields.category = "country"; 
          } else {
            if(chart){
              chart=null;
            }
          }
        }
      });
      
  })();
  
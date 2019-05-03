(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.BietReachQua", function (
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
      let chart;
      $scope.columns = [];

      $scope.getReportData = () => {
        $scope.columns = [{
          key: "center_name",
          title: "Trung tâm"
        }, ];
        let query = $scope.getSearchParams($scope.dataFilter);

        let data = [];
        ApiService.POST("reports/TacDong_BietReachQua", query).then(res => {
          let field_key = {};
          res.map(item => {
            for (let key in item.gender) {
              field_key[key] = true;
              item["total." + key] = item.gender[key].total;
              item["percent." + key] = item.gender[key].percent;
            }
            data.push(item);
          });


          for (let i in field_key) {
            let data = {};
            data.key = "total." + i;
            data.title = bietQua[i];
            data.percent = "percent." + i;
            $scope.columns.push(data);
          }
          $scope.dataReport = data;
          $scope.$apply();
          $scope.drawChartMale();

          $scope.updateRequestParams(query);
        });
      }

      $scope.dataChart = {};
      let bietQua = {
        1: "Bạn bè",
        101: "Bạn đã học ở reach",
        102: "Bạn đang học ở reach",
        103: "Bạn học cùng cấp 2,3",
        104: "Bạn học đang làm cùng",
        2: "Các tổ chức hiệp hội địa phương",
        201: "Hội phục nữ",
        202: "Hội khuyến học",
        203: "Hội Khuyêt tật",
        204: "Đoàn thanh niên phương xa",
        3: 'Quảng cáo in',
        301: "Tờ rơi",
        302: "Băng rôn áp phích Reach",
        303: "Bài báo giấy viết về Reach",
        4: "Đài",
        5: "thông tin trên mạng",
        501: "Facebook",
        502: "Báo mạng",
        503: "Website reach",
        504: "Trang tuyển dụng trực tuyến",
        6: "Các đối tác của Reach",
        601: 'Đối tác tại trường Reach',
        602: "tổ chức dự án hỗ trợ",
        603: "Doanh nghiệp",
        7: 'Giới thiệu trực tiếp',
        701: "Gia đình người thân giới thiệu",
        702: "Giáo viên cán bộ trung tâm Reach",
        703: "Cộng tác viên Reach",
        8: "Tivi",
        9: "Khác"
      }
      $scope.drawChartMale = () => {
        let dataDrawColums = [];
        if ($scope.dataReport && $scope.dataReport.length > 0) {
          //lọc lấy tất cả các loại biết đến reach
          $scope.dataReport.map(item => {
            for (let key in item.gender) {
              $scope.dataChart[key] = 0;
            }
          })
          // tính tổng từng loại
          $scope.dataReport.map(i => {
            for (let key in i.gender) {
              $scope.dataChart[key] = $scope.dataChart[key] + i.gender[key].total;
            }
          });
          // tạo data đẻ vẽ
          for (let key in $scope.dataChart) {
            let data = {};
            data.value = $scope.dataChart[key];
            data.category = bietQua[key];
            dataDrawColums.push(data);
          }
          //vẽ
          var chart = am4core.create("chartPice", am4charts.XYChart);
          // chart.scrollbarX = new am4core.Scrollbar();
          chart.data = dataDrawColums;
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "category";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 30;
          categoryAxis.renderer.labels.template.horizontalCenter = "right";
          categoryAxis.renderer.labels.template.verticalCenter = "middle";
          categoryAxis.renderer.labels.template.rotation = 270;
          categoryAxis.tooltip.disabled = true;
          categoryAxis.renderer.minHeight = 110;

          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.minWidth = 50;

          // Create series
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.sequencedInterpolation = true;
          series.dataFields.valueY = "value";
          series.dataFields.categoryX = "category";
          series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
          series.columns.template.strokeWidth = 0;

          series.tooltip.pointerOrientation = "vertical";

          series.columns.template.column.cornerRadiusTopLeft = 10;
          series.columns.template.column.cornerRadiusTopRight = 10;
          series.columns.template.column.fillOpacity = 0.8;

          // on hover, make corner radiuses bigger
          var hoverState = series.columns.template.column.states.create("hover");
          hoverState.properties.cornerRadiusTopLeft = 0;
          hoverState.properties.cornerRadiusTopRight = 0;
          hoverState.properties.fillOpacity = 1;

          series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
          });

          // Cursor
          chart.cursor = new am4charts.XYCursor();

        } else {
          if (chart) {
            chart = null;
          }
        }
      }
    });

})();

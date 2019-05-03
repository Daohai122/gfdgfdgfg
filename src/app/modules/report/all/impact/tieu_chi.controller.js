(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Report.TacDong.TieuChi", function (
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
      $scope.columns = [{
        key: "center_name",
        title: "Trung tâm"
      }, ];
      $scope.columnsRender;
      let list_tieuchi = {
        1:{
          title:"Hộ Gia đình nghèo",
          is_new:true
        },
        11:{
          title:"Hộ nghèo, Cận nghèo, thuộc diện nhà nước hỗ trợ đặc biệt, Gia đình chính sách",
          is_new:true
        },
        12:{
          title:"Đáp ứng Chuẩn nghèo của REACH",
          is_new:true
        },
        200:{
          title:"Bố mẹ không có khả năng chu cấp",
          is_new:false
        },
        31:{
          title:"Mồ côi cả cha và mẹ",
          is_new:true
        },
        202:{
          title:"Cả bố và mẹ mắc bệnh và không có khả năng làm việc hay chu cấp cho gia đình",
          is_new:false
        },
        203:{
          title:"Bố hoặc mẹ bị tàn tật/bệnh hiểm nghèo và không có khả năng làm việc hay chu cấp cho gia đình",
          is_new:false
        },
        204:{
          title:"Ít nhất một thành viên trong gia đình bị bệnh hiểm nghèo",
          is_new:false
        },
        205:{
          title:"Có hoàn cảnh tương tự khác mà gia đình không thể chu cấp cho học tập",
          is_new:false
        },
        24:{
          title:"Chung sống với HIV/AIDS",
          is_new:true
        },
        23:{
          title:" Nạn nhân của buôn bán người ",
          is_new:true
        },
        25:{
          title:"Thanh niên hành nghề mại dâm",
          is_new:true
        },
        21:{
          title:"Khuyết tật",
          is_new:true
        },
        27:{
          title:"Thanh niên Dân tộc thiểu số + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        800:{
          title:"Bộ đội xuất ngũ + Kinh tế khó khăn",
          is_new:false
        },
        43:{
          title:"Thanh niên có tiền án, tiền sự + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        902:{
          title:"Từng buôn bán ma túy/ nghiện",
          is_new:false
        },
        100:{
          title:"Gia đình chính sách + Kinh tế khó khăn",
          is_new:false
        },
        110:{
          title:"Thanh niên rủi ro + Kinh tế khó khăn",
          is_new:false
        },
        41:{
          title:"Làm việc trên đường phố  hoặc môi trường độc hại (gồm đánh giầy, bán vé số rong và phụ hồ)",
          is_new:true
        },
        44:{
          title:"Cha hoặc mẹ ở tù+Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        45:{
          title:"Cha hoặc mẹ là người buôn bán ma túy+ Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        47:{
          title:"Thanh niên không có giấy tờ xác nhận nhân thân+ Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        48:{
          title:" Thanh niên Bỏ học (chưa học hết lớp 12)+ Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        49:{
          title:"Gia đình có người nghiện+ Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        22:{
          title:"Nạn nhân của bạo lực gia đình",
          is_new:true
        },
        26:{
          title:"LGBT (Đồng tính nữ/nam, song tính, chuyển giới)+Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        120:{
          title:"Gia đình bị ảnh hưởng bởi HIV/AIDS + Kinh tế khó khăn",
          is_new:false
        },
        36:{
          title:"Bà mẹ đơn thân + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        53:{
          title:"Gia đình tái định cư + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        52:{
          title:"Thanh niên di cư + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        51:{
          title:"Gia đình thuần nông, ngư nghiệp +  Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        170:{
          title:"Gia đình tan vỡ + Kinh tế khó khăn",
          is_new:false
        },
        32:{
          title:"Mồ côi cha hoặc mẹ + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        33:{
          title:"Cha mẹ ly dị+ Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
        35:{
          title:"Chỉ có một mình cha hoặc mẹ nuôi dậy hoặc không sống cùng cha mẹ vì lý do gia đình hoặc kinh tế + Đáp ứng Một chỉ số trong Danh mục Nghèo đa chiều của REACH",
          is_new:true
        },
      }

      $scope.exportExcel = () => {
        let colums = [
          { key: "student_code", title: "Mã sinh viên"},
          { key: "full_name", title: "Họ tên" },
          { key: "categories",
           title: "Tiêu chí",
            render:(data) => {
              let view = list_tieuchi;
              if(data && data.length>0) {
                let content=[];
                data.map(item => {
                  content.push(view[item].title);
                });
                return content.join(', ');
              } else {
                return '';
              }
            }
          }
        ];
        $scope.exportDataToExcel(colums, 'Tiêu chí');
      };

      $scope.getReportData = () => {
        let query = $scope.getSearchParams($scope.dataFilter);

        let data = [];
        ApiService.POST("reports/TacDong_TieuChi", query).then(res => {
          let field_key = {};
          res.map(item => {
            for (let key in item.list_category) {
              field_key[key] = true;
              item["count." + key] = item.list_category[key].count;
              item["percent." + key] = item.list_category[key].percent;
            }
            data.push(item);
          });

          let dataColumns = $scope.columns.slice(0);

          for (let i in field_key) {
            let data = {};
            data.key = "count." + i;
            data.title = list_tieuchi[i].title;
            data.percent = "percent." + i;
            dataColumns.push(data);
          }
          $scope.columnsRender = dataColumns;
          $scope.dataReport = data;
          $scope.$apply();
          $scope.drawChartMale();

          $scope.updateRequestParams(query);
        });
      }
      $scope.dataChart = {};
      $scope.drawChartMale = () => {
        let dataDrawColums = [];
        if ($scope.dataReport && $scope.dataReport.length > 0) {
          //lọc lấy tất cả các loại biết đến reach
          $scope.dataReport.map(item => {
            for (let key in item.list_category) {
              $scope.dataChart[key] = 0;
            }
          })
          // tính tổng từng loại
          $scope.dataReport.map(i => {
            for (let key in i.list_category) {
              $scope.dataChart[key] = $scope.dataChart[key] + i.list_category[key].count;
            }
          });
          // tạo data đẻ vẽ
          for (let key in $scope.dataChart) {
            let data = {};
            data.value = $scope.dataChart[key];
            data.category = list_tieuchi[key].title.length>30?(list_tieuchi[key].title.substring(0,30) + ' ...'): list_tieuchi[key].title;
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

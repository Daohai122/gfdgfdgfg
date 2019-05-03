(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.DoanhNghiep.HinhThucHopTac", function(
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

          ApiService.POST("reports/ReportCompany/DoanhNghiep_HinhThucHopTac", query).then(res => {
            let dataPice = res;
            $scope.dataReport = res;
            let dataObj={
              center_name:"Tổng số",
              total_company:0,
              tuyen_dung_hoc_vien:0,
              xay_dung_giao_trinh:0,
              thuc_tap_cho_hoc_vien:0,
              thuc_tap_cho_giao_vien:0,
              khach_moi_giang:0,
              ho_tro_tai_chinh:0,
              tai_tro_phi_tai_chinh:0,
              hop_tac_dao_tao:0,
              khac:0
            };
            $scope.dataReport.map(item=> {
              dataObj.total_company += item.total_company;
              dataObj.tuyen_dung_hoc_vien += item.tuyen_dung_hoc_vien;
              dataObj.xay_dung_giao_trinh += item.xay_dung_giao_trinh;
              dataObj.thuc_tap_cho_hoc_vien += item.thuc_tap_cho_hoc_vien;
              dataObj.thuc_tap_cho_giao_vien += item.thuc_tap_cho_giao_vien;
              dataObj.khach_moi_giang += item.khach_moi_giang;
              dataObj.ho_tro_tai_chinh += item.ho_tro_tai_chinh;
              dataObj.tai_tro_phi_tai_chinh += item.tai_tro_phi_tai_chinh;
              dataObj.hop_tac_dao_tao += item.hop_tac_dao_tao;
              dataObj.khac += item.khac;
            });
            $scope.drawPiceMale(dataObj);
            $scope.dataReport.push(dataObj);
            $scope.$apply();
           
          });
        }
        
        $scope.drawPiceMale =(dataColums) => {
         
          if(dataColums){
            let tong = dataColums.tuyen_dung_hoc_vien + dataColums.xay_dung_giao_trinh+dataColums.thuc_tap_cho_hoc_vien+dataColums.thuc_tap_cho_giao_vien+
            dataColums.khach_moi_giang+ dataColums.ho_tro_tai_chinh+ dataColums.tai_tro_phi_tai_chinh+dataColums.hop_tac_dao_tao+dataColums.khac;
            let dataDrawColums=[
              {category:"Tuyển dụng học viên", value:Math.round((dataColums.tuyen_dung_hoc_vien/tong)*100 *100)/100},
              {category:"Xây dựng giáo trình", value:Math.round((dataColums.xay_dung_giao_trinh/tong)*100*100)/100},
              {category:"Thực tập cho học viên", value:Math.round((dataColums.thuc_tap_cho_hoc_vien/tong)*100*100)/100},
              {category:"Thực tập cho giáo viên", value:Math.round((dataColums.thuc_tap_cho_giao_vien/tong)*100*100)/100},
              {category:"Khách mời giảng", value:Math.round((dataColums.khach_moi_giang/tong)*100*100)/100},
              {category:"Hỗ trợ tài chính", value:Math.round((dataColums.ho_tro_tai_chinh/tong)*100*100)/100},
              {category:"Hỗ trợ phi tài chính", value:Math.round((dataColums.tai_tro_phi_tai_chinh/tong)*100*100)/100},
              {category:"Hợp tác đào tạo", value:Math.round((dataColums.hop_tac_dao_tao/tong*100*100)/100)},
              {category:"Khác", value:Math.round((dataColums.khac/tong)*100*100)/100},
            ]
            //vẽ
            let contentChart = $($element).find("#chartPice")[0];
          var chart = am4core.create(contentChart, am4charts.XYChart);
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
          series.tooltipText = "[{categoryX}: bold]{valueY}[/]" +"%";
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
            if(chart){
              chart=null;
            }
          }
        }

        // su ly toan bo phan search

        $scope.$watch('dataFilter.list_center_code', function (newVal, oldVal) {
          if(oldVal && newVal != oldVal) {
            $scope.dataFilter.list_batch_id =[];
            $scope.dataFilter.class =[];
          }
        })
        $scope.$watch('dataFilter.list_batch_id', function (newVal, oldVal) {
          if(oldVal && newVal != oldVal) {
            $scope.dataFilter.class =[];
          }
        })
  
        $scope.centerChange =() => {
          $scope.getBatches();
        }
        $scope.batchChange =() => {
          $scope.getClass();
        }
  
        $scope.getBatches = () => {
          OptionService.getBatch({center_codes: $scope.dataFilter.center}).then(res => {
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
          OptionService.getClass({batchIds: $scope.dataFilter.batch}).then(res => {
            $scope.class = res;
            $scope.$apply();
          }).catch(error => {
            // swal.fire({
            //   title: "Khóa học này này chưa có lớp học nào!",
            //   type: "error"
            // });
          });
        };
      });
      
  })();
  
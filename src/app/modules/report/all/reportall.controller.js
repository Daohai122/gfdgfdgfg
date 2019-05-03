(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Reportall.Controller", function (
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

      $scope.reportConfig = [{
          title: "Báo cáo tác động",
          viewName: "impact",
          reports: [{
              title: "Khảo sát Qol hoàn thành",
              reportName: "TacDong_KhaoSatHoanThanh",
              templateUrl: "impact/khao_sat_hoan_thanh.html"
            },
            {
              title: "Cải thiện cuộc sống",
              reportName: "TacDong_CaiThienCuocSong",
              templateUrl: "impact/cai_thien_cuoc_song.html",
              controller: "Report.TacDong.CaiThienCuocSong"
            },
            {
              title: "HV nghỉ học",
              reportName: "TacDong_HocVienNghiHoc",
              templateUrl: "impact/hoc_vien_nghi_hoc.html"
            },
            {
              title: "Tiêu chí",
              reportName: "TacDong_TieuChi",
              templateUrl: "impact/tieu_chi.html"
            },
            {
              title: "Trình độ học vấn",
              reportName: "TacDong_TrinhDoHocVan",
              templateUrl: "impact/trinh_do_hoc_van.html"
            },
            {
              title: "Giới tính",
              reportName: "TacDong_GioiTinh",
              templateUrl: "impact/gioi_tinh.html"
            },
            {
              title: "Lớp",
              reportName: "TacDong_Lop",
              templateUrl: "impact/lop.html"
            },
            {
              title: "Biết REACH qua",
              reportName: "TacDong_BietReachQua",
              templateUrl: "impact/biet_reach_qua.html"
            },
            {
              title: "Nhóm tuổi",
              reportName: "TacDong_NhomTuoi",
              templateUrl: "impact/nhom_tuoi.html"
            },
          ]
        }, {
          title: "Kết quả",
          viewName: 'result',
          reports: [{
              title: "HV có việc làm trong 6 tháng",
              reportName: "KetQua_HVCoViecLam",
              templateUrl: "result/hocviencoviec.html"
            },
            {
              title: "Cải thiện thu nhập",
              reportName: "KetQua_CaiThienThuNhap",
              templateUrl: "result/cai_thien_thu_nhap.html"
            },
            {
              title: "Mức lương trung bình",
              reportName: "KetQua_MucLuongTrungBinh",
              templateUrl: "result/muc_luong_trung_binh.html"
            },
            {
              title: "Internship",
              reportName: "KetQua_Intership",
              templateUrl: "result/internship.html"
            },
            {
              title: "Income range",
              reportName: "KetQua_ImcomeRange",
              templateUrl: "result/income_range.html"
            },
          ]
        }, {
          title: "Đầu ra",
          viewName: "output",
          reports: [{
              title: "Số HV đào tạo",
              reportName: "DauRa_SoHVDaoTao",
              templateUrl: "output/so_hoc_vien_dao_tao.html"
            },
            {
              title: "HV tốt nghiệp",
              reportName: "DauRa_SoHocVienDaoTao",
              templateUrl: "output/hoc_vien_tot_nghiep.html"
            },
            {
              title: "Số học HV đang đào tạo",
              reportName: "DauRa_SoHVDangDaoTao",
              templateUrl: "output/so_hoc_vien_dang_dao_tao.html"
            },
            {
              title: "Lương cơ bản",
              reportName: "DauRa_LuongCoBan",
              templateUrl: "output/luong_co_ban.html"
            },
            {
              title: "HV có việc làm",
              reportName: "DauRa_HVCoViecLam",
              templateUrl: "output/hoc_vien_co_viec_lam.html"
            },
            {
              title: "Việc làm trái ngành",
              reportName: "DauRa_ViecLamTraiNghanh",
              templateUrl: "output/viec_lam_trai_nghanh.html"
            },
            {
              title: "Loại hợp đồng",
              reportName: "DauRa_LoaiHopDong",
              templateUrl: "output/loai_hop_dong.html"
            },
          ]
        },
        {
          title: "Doanh nghiệp",
          viewName: "company",
          reports: [{
              title: "Hình thức hợp tác",
              reportName: "DoanhNghiep_HinhThucHopTac",
              templateUrl: "company/hinh_thuc_hop_tac.html"
            },
            {
              title: "Số lượng doanh nghiệp",
              reportName: "DoanhNghiep_SoLuongDoanhNghiep",
              templateUrl: "company/so_luong_doanh_nghiep.html"
            },
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
         /**
       * xuất excel
       */

      $scope.exportDataToExcel = (colums, nameReport) => {
        /**
         * Mẫu dulieu truyen vao
         * colums =[{key:"center_name",title:"Trung Tâm"},{key:"class_name",title:"Tên lớp"},{key:"full_name",title:"Họ tên"},{key:"student_code",title:"Mã sinh viên",render:funticon}]
         * 
         * truyền hàm render khi muốn custom dữ liệu
         * 
         */
        let columsMain =[{key:"stt", title:"STT"}];
        columsMain = columsMain.concat(colums);
        let query = $scope.getSearchParams($scope.dataFilter);
        let tableHeader='';
        columsMain.forEach(item => {
          tableHeader += '<th>'+item.title+'</th>';
        });
        let tableHtml =
        '<thead>'+'<tr>'
            +
            tableHeader
            +
            '</tr>'+
        '</thead>';
        ApiService.POST('reports/exportStudentData',query).then(res => {
         let data;
         let tbody = '<tbody>';
         let count = 0;
         res.forEach(value => {
           count ++;
           let content = '<tr>';
           columsMain.forEach(item => {
             let dulieu='';
             if(item.render){
                dulieu = item.render(value[item.key], value);
             } else {
              dulieu = (item.key=="stt"?count:value[item.key])
             }
             content += '<td style="text-align:left">'+ dulieu +'</td>';
          });
          tbody = tbody +content +'</tr>';
         });
         data = tableHtml +tbody +'</tbody>';
         ApiService.tableToExcel(nameReport,data);
        });
      };

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

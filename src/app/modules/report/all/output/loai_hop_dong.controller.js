(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.DauRa.LoaiHopDong", function(
        $rootScope,
        $stateParams,
        $state,
        $scope,
        $compile,
        ApiService,
      OptionService
      ) {
        $scope.init= () =>{
          $scope.getReportData();
          $scope.getCenter();
        }
        
        $scope.dataReport;
        $scope.columns = [{
            key: "batch_name",
            title: "Khóa"
          },
          
          {
            key: "lan_thu",
            title: "Lần thứ"
          },
          {
            key: "job_count",
            title: "Số lượng việc làm"
          }
        ];
  
        $scope.getReportData = () => {
          let query = $scope.getSearchParams($scope.dataFilter);
          let data = {};
          ApiService.POST("/reports/DauRa_LoaiHopDong", query).then(res => {
            let field_key = {};
            res.map(item => {
              for (let key in item.job_type) {
                field_key[key] = true;
                item["loai." + key] = item.job_type[key].count_job_type;
              }
              if (data[item.center_name]) {
                data[item.center_name].items.push(item);
              } else {
                data[item.center_name] = {
                  center_name: item.center_name,
                  items: [item]
                }
              }
              // return item;
            });
            let typeJob = {0:"Chưa biết", 1:"3 tháng", 2:"6 tháng",3:"1 năm", 4: "Khác", 5:"Thử việc", 6:"Thời vụ", 7: "Vô thời hạn", 8:'Không hợp đồng', 9: "Tự kinh doanh"};
            for (let field_code in field_key) {
              let data = {};
              data.key = "loai." + field_code;
              data.title = typeJob[field_code];
              $scope.columns.push(data);
            }
            $scope.dataReport = data;
            $scope.$apply();
            $scope.updateRequestParams(query);
          });
        };
      });
      
  })();
  
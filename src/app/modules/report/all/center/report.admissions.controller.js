(function() {
    "use strict";
    angular
      .module("MyApp")
      .controller("Report.Center.Admissions.Controller", function(
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
        
        $scope.columns=[];
        $scope.dataReportClass;
        $scope.dataReportChanne;
  
        $scope.getReportData = () => {
          $scope.columns=[];
          // $scope.columns=[{title:"Kênh", key:""},{title:"Số lượng(hồ sơ)",key:""},{title:"Tỉ lệ", key:""},{title:"Ghi chú",key:""}];
          
          let query = $scope.getSearchParams($scope.dataFilter);
          ApiService.POST("reports/TrungTam_KetQuaTuyenSinh", query).then(res => {
            $scope.dataReportClass = res.result_by_class;
            $scope.dataReportChane = res.result_by_channel;
            let data=[];
            let field_colums ={};
            res.result_by_channel.map(item => {
              for(let key in item.list_class) {
                field_colums[key] = true;
                item[key] = item.list_class[key];
              }
              data.push(item)
            });
            for(let key in field_colums) {
              let data={};
              data.key = key;
              data.title = key;
              $scope.columns.push(data);
            }
            $scope.dataReportChane = data;
            $scope.$apply();
            $scope.updateRequestParams(query);
  
          });
        };
      });
      
  })();
  
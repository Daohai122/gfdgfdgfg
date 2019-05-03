(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin.center_report", {
          url: "/center_report/:view/:reportName",
          templateUrl: "/app/modules/report/center/index.html",
          controller: "Report.Center.Controller",
        })

        .state("admin.report_all", {
          url: "/report_all/:view/:reportName",
          templateUrl: "/app/modules/report/all/index.html",
          controller: "Reportall.Controller",
        })
    });
})();

(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.feedback", {
          url: "/feedback",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.feedback.list", {
          url: "/list",
          templateUrl: "/app/modules/feedback/list.feedback.html",
          controller: "List.Feedback.Controller",
          title: "Danh sách feedback và góp ý",
          mode: "mobile"
        })
      });
  })();
  
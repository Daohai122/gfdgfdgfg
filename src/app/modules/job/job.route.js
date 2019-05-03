(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.job", {
          url: "/job",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.job.list", {
          url: "/list",
          templateUrl: "/app/modules/job/list.job.html",
          controller: "List.Job.Controller",
          title: "Danh sách công việc",
          mode: "mobile"
        }).state("admin.job.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/job/edit.job.html",
          controller: "Edit.Job.Controller",
          title: "Sửa công việc",
          mode: "mobile"
        })
      });
  })();
  
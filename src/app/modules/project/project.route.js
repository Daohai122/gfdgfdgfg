(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin.project", {
          url: "/project",
          abtract: true,
          template: "<div ui-view></div>"
        }).state("admin.project.add", {
          url: "/add",
          templateUrl: "/app/modules/project/add.project.html",
          controller: "Add.Project.Controller",
          title: "Thêm dự án"
        }).state("admin.project.list", {
          url: "/list",
          templateUrl: "/app/modules/project/list.project.html",
          controller: "List.Project.Controller",
          title: "Danh sách dự án"
        })
        .state("admin.project.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/project/edit.project.html",
          controller: "Edit.Project.Controller",
          title: "Sửa dự án"
        })
    });
})();

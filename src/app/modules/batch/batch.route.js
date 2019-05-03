(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.batch", {
          url: "/batch",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.batch.list", {
          url: "/list",
          templateUrl: "/app/modules/batch/list.batch.html",
          controller: "List.Batch.Controller",
          title:"Danh sách khóa học"
        }).state("admin.batch.add", {
          url: "/add",
          templateUrl: "/app/modules/batch/add.batch.html",
          controller: "Add.Batch.Controller",
          title:"Thêm khóa học"
        }).state("admin.batch.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/batch/edit.batch.html",
          controller: "Edit.Batch.Controller",
          title:"Sửa khóa học"
        })
      });
  })();
  
(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.class", {
          url: "/class",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.class.list", {
          url: "/list",
          templateUrl: "/app/modules/class/list.class.html",
          controller: "List.Class.Controller",
          title:"Danh sách lớp học"
        }).state("admin.class.add", {
          url: "/add",
          templateUrl: "/app/modules/class/add.class.html",
          controller: "Add.Class.Controller",
          title:"Thêm lớp học"
        }).state("admin.class.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/class/edit.class.html",
          controller: "Edit.Class.Controller",
          title:"Sửa lớp học"
        })
      });
  })();
  
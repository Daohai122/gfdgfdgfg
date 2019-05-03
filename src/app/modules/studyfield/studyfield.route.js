(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.studyfield", {
          url: "/studyfield",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.studyfield.list", {
          url: "/list",
          templateUrl: "/app/modules/studyfield/list.studyfield.html",
          controller: "List.Studyfield.Controller",
          title:"Danh sách ngành học"
        }).state("admin.studyfield.add", {
          url: "/add",
          templateUrl: "/app/modules/studyfield/add.studyfield.html",
          controller: "Add.Studyfield.Controller",
          title:"Thêm ngành học"
        }).state("admin.studyfield.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/studyfield/edit.studyfield.html",
          controller: "Edit.Studyfield.Controller",
          title:"Sửa ngành học"
        })
      });
  })();
  
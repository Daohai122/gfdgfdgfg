(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
          .state("admin.center", {
            url: "/center",
            abtract: true,
            template: "<div ui-view></div>",
          }).state("admin.center.add", {
            url: "/add",
            templateUrl: "/app/modules/center/add.center.html",
            controller: "Add.Center.Controller",
            title: "Thêm trung tâm"
          })
          .state("admin.center.list", {
            url: "/list",
            templateUrl: "/app/modules/center/list.center.html",
            controller: "List.Center.Controller",
            title: "Danh sách trung tâm"
          })
          .state("admin.center.edit", {
            url: "/edit/:id",
            templateUrl: "/app/modules/center/edit.center.html",
            controller: "Edit.Center.Controller",
            title: "Sửa trung tâm"
          })
      });
  })();
  
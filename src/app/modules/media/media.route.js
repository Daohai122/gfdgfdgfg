(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.media", {
          url: "/media",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.media.list", {
          url: "/list",
          templateUrl: "/app/modules/media/list.media.html",
          controller: "List.Media.Controller",
          title: "Danh sách truyền thông"
        }).state("admin.media.add", {
          url: "/add",
          templateUrl: "/app/modules/media/add.media.html",
          controller: "Add.Media.Controller",
          title: "Thêm truyền thông"
        }).state("admin.media.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/media/edit.media.html",
          controller: "Edit.Media.Controller",
          title: "Sửa truyền thông"
        })
      });
  })();
  
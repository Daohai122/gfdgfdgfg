(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.user", {
          url: "/user",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.user.list", {
          url: "/list",
          templateUrl: "/app/modules/user/list.user.html",
          controller: "List.User.Controller",
          title: "Danh sách người dùng"
        })
        .state("admin.user.add", {
          url: "/add",
          templateUrl: "/app/modules/user/add.user.html",
          controller: "Add.User.Controller",
          title: "Thêm người dùng"
        })
        .state("admin.user.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/user/edit.user.html",
          controller: "Edit.User.Controller",
          title: "Sửa người dùng"
        })
      });
  })();
  
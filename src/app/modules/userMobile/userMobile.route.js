(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.userMobile", {
          url: "/userMobile",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.userMobile.list", {
          url: "/list",
          templateUrl: "/app/modules/userMobile/list.user.mobile.html",
          controller: "List.User.Mobile.Controller",
          title: "Danh sách người dùng mobile",
          mode: "mobile"
        })
        .state("admin.userMobile.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/userMobile/edit.user.mobile.html",
          controller: "Edit.User.Mobile.Controller",
          title: "Sửa người dùng mobile",
          mode: "mobile"
        })
      });
  })();
  
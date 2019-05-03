(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin.categories", {
          url: "/categories",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.categories.list", {
          url: "/list",
          templateUrl: "/app/modules/categories/list.categories.html",
          controller: "List.Categories.Controller",
          title: "Danh sách danh mục",
          mode: "mobile"
        })
    });
})();

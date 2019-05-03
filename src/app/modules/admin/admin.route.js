(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin", {
          url: "/admin",
          templateUrl: "/app/modules/admin/admin.html",
          controller: "Admin.Controller"
        })
    });
})();

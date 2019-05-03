(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin.permission", {
          url: "/permission?:role",
          templateUrl: "/app/modules/permission/permission.html",
          controller: "Permission.Controller"
        })
    });
})();

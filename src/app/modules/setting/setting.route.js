(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin.setting", {
          url: "/setting",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.setting.permission", {
          url: "/permission",
          templateUrl: "/app/modules/setting/setting.permission.html",
          controller: "Add.Partner.Controller"
        }).state("admin.setting.term", {
          url: "/term",
          templateUrl: "/app/modules/setting/setting.term.user.html",
          controller: "Term.Controller",
          mode: 'mobile'
        })
    });
})();

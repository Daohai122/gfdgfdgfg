(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("admin.account", {
          url: "/account",
          abtract: true,
          template: "<div ui-view></div>",
        })
        .state("admin.account.profile", {
          url: "/profile",
          templateUrl: "/app/modules/account/account.profile.html",
          controller: "Account.Profile.Controller",
          title: "Cập nhật tài khoản"
        })
    });
})();

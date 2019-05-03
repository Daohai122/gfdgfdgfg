(function () {
  'use strict';
  angular
    .module('MyApp')
    .config(function routerConfig($stateProvider) {
      $stateProvider
        .state("auth", {
          url: "/auth",
          abtract: true,
          templateUrl: "/app/modules/auth/index.html",
          // controller: "Login.Controller"
        })
        .state("auth.login", {
          url: "/login",
          templateUrl: "/app/modules/auth/login.html",
          controller: "Login.Controller"
        })

        .state("auth.reset-password", {
          url: "/reset-password",
          templateUrl: "/app/modules/auth/reset-password.html",
          controller: "Login.Controller"
        })
        .state("auth.forget-password", {
          url: "/forget-password",
          templateUrl: "/app/modules/auth/forget-password.html",
          controller: "Login.Controller"
        })
    });
})();

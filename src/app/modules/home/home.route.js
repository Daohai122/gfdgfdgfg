(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("home", {
          url: "/",
          abtract: true,
          templateUrl: "/app/modules/home/home.html",
          controller: "Home.Controller",
          title: "Trang chủ"
        })
      });
  })();
  
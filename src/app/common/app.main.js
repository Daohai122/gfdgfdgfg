(function () {
  "use strict";
  /***
  Metronic AngularJS App Main Script
  ***/

  // angular.module("Auth", []);

  /* Metronic App */
  var MyApp = angular.module("MyApp", [
    "ui.router",
    // "ui.bootstrap",
    // "oc.lazyLoad",
    "ngSanitize",
    "pascalprecht.translate",
    // "restangular"
    // "Auth"
  ]);

  /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad)
   *  Cấu hình ngôn ngữ
   */
  MyApp.config(function ($translateProvider) {
    // $ocLazyLoadProvider.config({
    //   // global configs go here
    // });

    let translations_vi = {};
    let translations_en = {};

    App_Dictionary.forEach(item => {
      if (item.length == 2) {
        translations_vi[item[0]] = item[0];
        translations_en[item[0]] = item[1];
      } else if (item.length == 3) {
        translations_vi[item[0]] = item[1];
        translations_en[item[0]] = item[2];
      }
    });

    $translateProvider.translations("vi", translations_vi);
    $translateProvider.translations("en", translations_en);

    $translateProvider.preferredLanguage("vi");
  });

  MyApp.config([
    "$httpProvider",
    function ($httpProvider) {
      $httpProvider.interceptors.push("myInterceptor");
    }
  ]);

  MyApp.factory("myInterceptor", function ($q) {
    var requestInterceptor = {
      request: function (config) {
        var deferred = $q.defer();
        deferred.resolve(config);

        //Khởi tạo thanh loading
        NProgress.start();

        return deferred.promise;
      },
      response: function (response) {
        var deferred = $q.defer();

        deferred.resolve(response);

        //Hoàn tất thanh loading
        NProgress.done();

        // someAsyncService.doAsyncOperation().then(function () {
        //   // Asynchronous operation succeeded, modify response accordingly
        //   deferred.resolve(response);
        // }, function () {
        //   // Asynchronous operation failed, modify response accordingly
        //   deferred.resolve(response);
        // });

        return deferred.promise;
      }
    };

    return requestInterceptor;
  });

  //AngularJS v1.3.x workaround for old style controller declarition in HTML
  // MyApp.config(['$controllerProvider', function ($controllerProvider) {
  //   // this option might be handy for migrating old apps, but please don't use it
  //   // in new ones!
  //   // $controllerProvider.allowGlobals();
  // }]);

  // var restangularProvider;
  // Init global settings request run the app
  // MyApp.config(function (RestangularProvider) {
  //   restangularProvider = RestangularProvider;
  //   // RestangularProvider.setBaseUrl(SCH.host + "");
  //   // RestangularProvider.setDefaultHeaders({
  //   //   "Authorization": "Bearer " + $.cookie("access_token")
  //   // });
  // });

  /********************************************
   END: BREAKING CHANGE in AngularJS v1.3.x:
  *********************************************/

  /* Setup global settings */
  MyApp.factory("settings", [
    "$rootScope",
    function ($rootScope) {
      var folder = "/";
      // var basePath = window.location.origin + folder;

      return settings;
    }
  ]);

  // /* Setup App Main Controller */
  MyApp.controller("AppController", function (
    $scope,
    $rootScope,
    $templateCache
  ) {
    $scope.$on("$viewContentLoaded", function () {
      // App.initComponents(); // init core components
      // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
      $templateCache.removeAll();
    });
  });

  /* Setup Rounting For All Pages */
  MyApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.hashPrefix("!");
    // by default '!'
    $locationProvider.html5Mode(true);

    if (localStorage.getItem("auth")) {
      // location.href = "/admin";
      // $urlRouterProvider.otherwise("/admin");
    } else {
      localStorage.href = "/auth/login";
      // $urlRouterProvider.otherwise("/auth/login");
    }
  });

  /* Init global settings request run the app */
  // MyApp.config(function ($httpProvider) {});

  /* Init global settings and run the app */
  MyApp.run(function ($rootScope, $state, $location, $translate, $http, APP_CONFIG, AuthService) {
    $rootScope.menuItems = APP_CONFIG.menuItems;
    $rootScope.appMenuItems = APP_CONFIG.appMenuItems;
    $rootScope.currentLanguage = "vi";
    if (localStorage.getItem("language") == "en") {
      $rootScope.currentLanguage = "en";
    }
    $http.defaults.headers.common["Accept-Language"] = $rootScope.currentLanguage;

    $rootScope.changeLanguage = function (lang) {
      $rootScope.currentLanguage = lang;
      localStorage.setItem("language", lang);
      $translate.use(lang);
      $http.defaults.headers.common["Accept-Language"] = lang;
    };



    // $rootScope.$state = $state;
    // state to be accessed from view
    // $rootScope.$settings = settings; // state to be accessed from view
    // $rootScope.$state.current.pageTitle = "Trang chủ";
    // $rootScope.waitingRequestCount = 0;

    //Sinh menu động
    // $rootScope.menuConfig = APP_CONFIG.menuConfig;
    //----------phần check quyền----------

    //Kiểm tra route có được phép truy cập hay không


  });

  NProgress.configure({
    trickleSpeed: 500,
    showSpinner: true,
    minimum: 0.2,
    easing: "ease",
    speed: 1000
  });
})();

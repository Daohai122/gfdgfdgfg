(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
          .state("admin.contact_mobile", {
            url: "/contact_mobile",
            title: "Liên kết tham khảo",
            templateUrl: "/app/modules/configInforMobile/configContactMobile.html",
            controller: "Config.Contact.Mobile.Controller",
            mode: 'mobile'
          })
      });
  })();
  
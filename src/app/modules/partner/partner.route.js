(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.partner", {
          url: "/partner",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.partner.add", {
          url: "/add",
          templateUrl: "/app/modules/partner/add.partner.html",
          controller: "Add.Partner.Controller",
          title: "Thêm đối tác"
        }).state("admin.partner.list", {
          url: "/list",
          templateUrl: "/app/modules/partner/list.partner.html",
          controller: "List.Partner.Controller",
          title: "Danh sách đối tác"
        })
        .state("admin.partner.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/partner/edit.partner.html",
          controller: "Edit.Partner.Controller",
          title: "Sửa đối tác"
        }).state("admin.partner.editContact", {
          url: "/editContact/:id",
          templateUrl: "/app/modules/partner/edit.partner.contact.html",
          controller: "Edit.Partner.Contact.Controller",
          title: "Sửa thông tin đối tác"
        })
        .state("admin.partner.addContact", {
          url: "/addContact/:id",
          templateUrl: "/app/modules/partner/add.partner.contact.html",
          controller: "Add.Partner.Contact.Controller",
          title: "Thêm thông tin đối tác"
        })
      });
  })();
  
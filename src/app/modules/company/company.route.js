(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.company", {
          url: "/company",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.company.add", {
          url: "/add",
          templateUrl: "/app/modules/company/add.company.html",
          controller: "Add.Company.Controller",
          title: "Thêm doanh nghiệp"
        })
        .state("admin.company.list", {
          url: "/list",
          templateUrl: "/app/modules/company/list.company.html",
          controller: "List.Company.Controller",
          title: "Danh sách doanh nghiệp"
        })
        .state("admin.company.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/company/edit.company.html",
          controller: "Edit.Company.Controller",
          title: "Sửa doanh nghiệp"
        })
      });
  })();
  
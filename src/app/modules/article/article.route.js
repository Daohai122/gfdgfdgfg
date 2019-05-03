(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.article", {
          url: "/article",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.article.list", {
          url: "/list",
          templateUrl: "/app/modules/article/list.article.html",
          controller: "List.Article.Controller",
          title: "Danh sách bài viết",
          mode: "mobile"
        })
        .state("admin.article.edit", {
          url: "/edit/:id",
          templateUrl: "/app/modules/article/edit.article.html",
          controller: "Edit.Article.Controller",
          title: "Sửa bài viết",
          mode: "mobile"
        })
        .state("admin.article.add", {
          url: "/add",
          templateUrl: "/app/modules/article/add.article.html",
          controller: "Add.Article.Controller",
          title: "Thêm bài viết",
          mode: "mobile"
        })
      });
  })();
  
(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.comment", {
          url: "/comment",
          abtract: true,
          template: "<div ui-view></div>",
        })
        // .state("admin.comment.list", {
        //   url: "/list",
        //   templateUrl: "/app/modules/comment/list.comment.html",
        //   controller: "List.Comment.Controller",
        //   title: "Danh sách các bình luận",
        //   mode: "mobile"
        // })
        .state("admin.comment.listNew", {
          url: "/listNew?articleId",
          templateUrl: "/app/modules/comment/list.comment.new.html",
          controller: "List.Comment.New.Controller",
          title: "Danh sách các bình luận",
          mode: "mobile",
          reloadOnSearch: false,
        })
      });
  })();
  
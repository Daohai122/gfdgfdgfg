(function () {
    'use strict';
    angular
      .module('MyApp')
      .config(function routerConfig($stateProvider) {
        $stateProvider
        .state("admin.user_group", {
          url: "/user_group",
          abtract: true,
          template: "<div ui-view></div>",
        }).state("admin.user_group.list", {
          url: "/list",
          templateUrl: "/app/modules/groupUser/groupuser.html",
          controller: "List.Group.User.Controller",
          title: "Danh sách nhóm người dùng",
          mode: "mobile"
        })
        // .state("admin.user_group.edit", {
        //   url: "/edit/:id",
        //   templateUrl: "/app/modules/groupUser/edit.groupuser.html",
        //   controller: "Edit.Group.User.Controller",
        //   title: "Chỉnh sửa nhóm người dùng"
        // })
        // .state("admin.user_group.add", {
        //   url: "/add",
        //   templateUrl: "/app/modules/groupUser/add.groupuser.html",
        //   controller: "Add.Group.User.Controller",
        //   title: "Chỉnh sửa nhóm người dùng"
        // })
        
      });
  })();
  
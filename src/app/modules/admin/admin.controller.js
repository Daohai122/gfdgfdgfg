(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Admin.Controller", function ($rootScope, $state, $scope, ApiService, AuthService, $location) {

      $scope.menuMode = 'admin';
      $scope.searchState = {};
      $scope.currentState = '';

      $scope.changeState = (state) => {
        if ($state.current.name == state) {
          $state.go(state, {}, {reload: state, notify: false});
        } else {

        }
      }

      $scope.init = () => {
        if (localStorage.getItem('menuMode') == "mobile") {
          $scope.menuMode = 'mobile';
        };
        $scope.getInfoAccount();

        if ($state.$current.mode == 'mobile' && $scope.menuMode != 'mobile') {
          $scope.menuMode = 'mobile';
        } else if ($state.$current.mode == undefined && $scope.menuMode != 'admin') {
          $scope.menuMode = 'admin';
        }
      }

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $('[data-toggle="m-tooltip"]').tooltip('hide');
        $('.note-btn').tooltip('hide');
        //save location.search so we can add it back after transition is done
        if (fromState.name.split('.').pop() == 'list') {
          $scope.currentState = fromState.name;
          $scope.searchState = $location.search();
        }
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //restore all query string parameters back to $location.search
        if (toState.name.split('.').pop() == 'list') {
          if ($scope.currentState.split('.')[1] == toState.name.split('.')[1]) {
            $location.search($scope.searchState);
          } else {
            $scope.searchState = {};
          }
        }
      });

      $scope.doLogout = function () {
        AuthService.logout();
      }

      $scope.setMenuMode = function (mode) {
        $scope.menuMode = mode;
        localStorage.setItem('menuMode', mode);
        $state.go('admin');
        $('body').addClass('m-aside-left--minimize');
      }

      $scope.dataMyinfomation;

      $scope.getInfoAccount = function () {

        let permissions = [];
        AuthService.getMyInfo().then(resp => {
          $scope.dataMyinfomation = resp;
          $scope.dataMyinfomation.profileImageUrl = GLOBAL_CONFIG.UPLOAD + $scope.dataMyinfomation.profileImageUrl;

          let permissionNames = {};
          resp.permissions.forEach(item => {
            permissionNames[item] = true;
          });

          $rootScope.userPermissions = permissionNames;

          permissions = resp.permissions;
          AssignPermissionView($rootScope.menuItems);
          AssignPermissionView($rootScope.appMenuItems);

          // $scope.$apply();
        });

        /**
         * Check trạng thái hiển thị của từng menuItem
         */
        function AssignPermissionView(items) {
          let hasChild = false;
          items.forEach(item => {
            if (item.permissions) {
              if (item.permissions.length == 1) {
                if (permissions.indexOf(item.permissions[0]) >= 0) {
                  item.visible = true;
                  hasChild = true;
                } else {

                }
              }
            }
            else{
              item.visible = true;
            }

            if (item.children) {
              if (AssignPermissionView(item.children)) {
                item.visible = true;
                hasChild = true;
              }
            }

          });

          return hasChild;
        }
      }

      // Page title in header
      $scope.$watch(function () {
        return $state.$current
      }, function (newVal, oldVal) {
        $scope.pageTitle = newVal.title;
        $('body').addClass('m-aside-left--minimize');
        $('body').removeClass('m-aside-left--on');
        $('#m_aside_left').removeClass('m-aside-left--on');
      })
    });
})();

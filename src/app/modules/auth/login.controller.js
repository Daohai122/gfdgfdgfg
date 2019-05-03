(function () {
  "use strict";
  angular
    .module("MyApp")
    .controller("Login.Controller", function ($rootScope, $state, $scope, ApiService, AuthService) {

      $scope.doLogin = function () {
        AuthService.login($scope.login).then(resp => {
          if (resp) {
            toastr.success("Đăng nhập thành công");
            location.href = "/admin";
          }
        });
      }

      $scope.setEmailForgotPassword = () => {
        $rootScope.accountEmail = $scope.forgotPassword.email;
        ApiService.POST('accounts/GetResetPasswordToken', 
          $scope.forgotPassword).then(res => {
            toastr.success("Gửi mã thành công, vui lòng kiểm tra email!");
            $state.go("auth.reset-password");
          })
      }

      $scope.changePassword = () => {
        if($scope.resetPassword.newPassword != $scope.resetPassword.confirmNewPassword){
          toastr.error("Mật khẩu xác nhận không khớp, vui lòng nhập lại!");
          return;
        }
        ApiService.POST('accounts/resetPassword', $scope.resetPassword).then(res => {
          toastr.success("Đổi mật khẩu thành công");
          $state.go("auth.login");
        })
      }

      $scope.signinAzureAD = () => {
        AuthService.signinAzureAD().then(result => {
          location.href = "/admin";
        })
      }
    });
})();

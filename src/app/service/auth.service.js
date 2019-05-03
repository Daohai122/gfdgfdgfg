(function () {
  "use strict";
  angular
    .module("MyApp")
    .service("AuthService", function (
      $rootScope,
      ApiService,
      $state,
      APP_CONFIG,
      $http
    ) {
      let self = this;

      this.checkLogin = function () {
        if (localStorage.getItem("auth")) {
          return true;
        } else return false;
      };

      this.login = function (input) {
        return ApiService.POST("accounts/login", input)
          .then(result => {
            localStorage.setItem("auth", JSON.stringify(result));
            $http.defaults.headers.common.Authorization =
              "Bearer " + result.accessToken;
            self.getMyInfo();
            return result;
          })
          .catch(error => {
            return false;
          });
      };

      this.logout = function () {
        localStorage.removeItem("auth");
        $state.go("auth.login");

        if ($rootScope.userInfo.authenticationSource == "AzureAD") {
          myMSALObj.logout();
        }
      };

      this.getMyInfo = function () {
        return ApiService.GET("accounts/MyInformation").then(resp => {
          APP_CONFIG.userInfo = resp;
          $rootScope.userInfo = resp;
          localStorage.setItem("userInfo", JSON.stringify(resp));
          return resp;
        });
      };

      var applicationConfig = {
        clientID: "ac6fe224-1191-406d-b2b9-eebb6cd1ac94", //This is your client ID
        authority: "https://login.microsoftonline.com/common", //Default authority value is https://login.microsoftonline.com/common
        graphScopes: ["user.read"],
        graphEndpoint: "https://graph.microsoft.com/v1.0/me"
      };

      var myMSALObj = new Msal.UserAgentApplication(
        applicationConfig.clientID,
        applicationConfig.authority,
        acquireTokenRedirectCallBack, {
          storeAuthStateInCookie: true,
          cacheLocation: "localStorage"
        }
      );

      this.signinAzureAD = () => {
        return myMSALObj.loginPopup(applicationConfig.graphScopes).then(
          function (idToken) {
            //Login Success
            return acquireTokenPopupAndCallMSGraph().then(token => {
              return ApiService.POST("accounts/AzureADLogin", {
                access_token: token
              }).then(result => {
                localStorage.setItem("auth", JSON.stringify(result));
                $http.defaults.headers.common.Authorization =
                  "Bearer " + result.accessToken;
                self.getMyInfo();
                return result;
              });
            });
          },
          function (error) {
            throw error;
          }
        );
      };

      // function signOutAzureAD() {
      //   myMSALObj.logout();
      // }

      function acquireTokenPopupAndCallMSGraph() {
        //Call acquireTokenSilent (iframe) to obtain a token for Microsoft Graph
        return myMSALObj.acquireTokenSilent(applicationConfig.graphScopes).then(
          function (accessToken) {
            return accessToken;
            // callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback);
          },
          function (error) {
            console.log(error);
            // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure due to consent or interaction required ONLY
            if (
              error.indexOf("consent_required") !== -1 ||
              error.indexOf("interaction_required") !== -1 ||
              error.indexOf("login_required") !== -1
            ) {
              myMSALObj.acquireTokenPopup(applicationConfig.graphScopes).then(
                function (accessToken) {
                  callMSGraph(
                    applicationConfig.graphEndpoint,
                    accessToken,
                    graphAPICallback
                  );
                },
                function (error) {
                  console.log(error);
                }
              );
            }
          }
        );
      }

      function callMSGraph(theUrl, accessToken, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200)
            callback(JSON.parse(this.responseText));
        };
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.setRequestHeader("Authorization", "Bearer " + accessToken);
        xmlHttp.send();
      }

      function graphAPICallback(data) {
        //Display user data on DOM
        var divWelcome = document.getElementById("WelcomeMessage");
        divWelcome.innerHTML += " to Microsoft Graph API!!";
        document.getElementById("json").innerHTML = JSON.stringify(
          data,
          null,
          2
        );
      }

      // This function can be removed if you do not need to support IE
      function acquireTokenRedirectAndCallMSGraph() {
        //Call acquireTokenSilent (iframe) to obtain a token for Microsoft Graph
        myMSALObj.acquireTokenSilent(applicationConfig.graphScopes).then(
          function (accessToken) {
            callMSGraph(
              applicationConfig.graphEndpoint,
              accessToken,
              graphAPICallback
            );
          },
          function (error) {
            console.log(error);
            //Call acquireTokenRedirect in case of acquireToken Failure
            if (
              error.indexOf("consent_required") !== -1 ||
              error.indexOf("interaction_required") !== -1 ||
              error.indexOf("login_required") !== -1
            ) {
              myMSALObj.acquireTokenRedirect(applicationConfig.graphScopes);
            }
          }
        );
      }

      function acquireTokenRedirectCallBack(
        errorDesc,
        token,
        error,
        tokenType
      ) {
        if (tokenType === "access_token") {
          callMSGraph(applicationConfig.graphEndpoint, token, graphAPICallback);
        } else {
          console.log("token type is:" + tokenType);
        }
      }
    });
})();

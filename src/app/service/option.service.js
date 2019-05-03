(function () {
	"use strict";
	angular.module("MyApp").service('OptionService', function ($http, $rootScope) {

		let auth = localStorage.getItem("auth");
		if (auth) {
			try {
				auth = JSON.parse(auth);
				$http.defaults.headers.common.Authorization = 'Bearer ' + auth.accessToken;

				let userInfo = localStorage.getItem("userInfo");
				if (userInfo) {
					userInfo = JSON.parse(userInfo);
					$rootScope.userInfo = userInfo;
				}
			} catch (error) {

			}
		}

		this.getArticleCategory = function (params, error) {
			return new Promise(function (resolve, reject) {
				$http.get(GLOBAL_CONFIG.API_URL + 'options/articleCategory').then(function (res) {
					processResponse(res, error, resolve);
				}, function (err) {
					showError(err)
					reject(err);
				});
			})
		};

		this.getCenter = function (params, error) {
			return new Promise(function (resolve, reject) {
				$http.get(GLOBAL_CONFIG.API_URL + 'options/center').then(function (res) {
					processResponse(res, error, resolve);
				}, function (err) {
					showError(err)
					reject(err);
				});
			})
		};

		this.getBatch = function (params, error) {
			return new Promise(function (resolve, reject) {
				$http.get(GLOBAL_CONFIG.API_URL + 'options/batch', {params: params}).then(function (res) {
					processResponse(res, error, resolve);
				}, function (err) {
					showError(err)
					reject(err);
				});
			})
		};

		this.getClass = function (params, error) {
			return new Promise(function (resolve, reject) {
				$http.get(GLOBAL_CONFIG.API_URL + 'options/class', {params: params}).then(function (res) {
					processResponse(res, error, resolve);
				}, function (err) {
					showError(err)
					reject(err);
				});
			})
		};

		function showError(res) {
			NProgress.done();

			if (res.status == 401) {
				location.href = "auth/login";
				return;
			}

			if (res.data.result && res.data.result.message) {
				swal.fire({
					title: res.data.result.message,
					type: "error"
				});
			}
		}

		function processResponse(res, error, resolve, reject) {
			if (res.status == 200) {
				resolve(res.data.result);
			} else {
				if (res.message) {
					toastr.error(res.message);
					reject(res);
				} else if (error) {
					if (typeof (error) == "function") {
						error();
					} else {
						toastr.error(error);
					}
					reject(res);
				}
			}
		}

	})
})();

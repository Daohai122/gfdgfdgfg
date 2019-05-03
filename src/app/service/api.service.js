(function () {
  "use strict";
  angular.module("MyApp").service('ApiService', function ($http, $rootScope) {

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

    this.POST = function (url, data, error) {
      return new Promise(function (resolve, reject) {
        $http.post(GLOBAL_CONFIG.API_URL + url, data).then(function (res) {
          processResponse(res, error, resolve);
        }, function (err) {
          showError(err)
          reject(err);
        });
      })
    };

    this.PUT = function (url, data, error) {
      return new Promise(function (resolve, reject) {
        $http.put(GLOBAL_CONFIG.API_URL + url, data).then(function (res) {
          processResponse(res, error, resolve);
        }, function (err) {
          showError(err)
          reject(err);
        });
      })
    };

    this.GET = function (url, params, error) {
      return new Promise(function (resolve, reject) {
        $http.get(GLOBAL_CONFIG.API_URL + url, {
          params: params
        }).then(function (res) {
          processResponse(res, error, resolve);
        }, function (err) {
          showError(err)
          reject(err);
        });
      })
    };

    this.upload = function (url, file, error) {
      var formData = new FormData();
      formData.append('file', file);
      return new Promise(function (resolve, reject) {
        Restangular.one(GLOBAL_CONFIG.API_URL + url).withHttpConfig({
            transformRequest: angular.identity
          })
          .customPOST(formData, '', undefined, {
            'Content-Type': undefined
          }).then(function (res) {
            processResponse(res, error, resolve, reject);
          }).catch(function (err) {
            showError(err);
            reject(err);
          });
      });

    };

    this.DELETE = function (url, data, error) {
      return new Promise(function (resolve, reject) {
        $http.delete(GLOBAL_CONFIG.API_URL + url).then(function (res) {
          if (res.status == 200) {
            resolve(res.data);
          } else {

            reject(res);
          }
        }, function (err) {
          showError(err);
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

    this.formatDate = (data) => {
      let date = new Date(data);
      date = (date.getDate().toString().length == 1 ? ("0" + date.getDate().toString()) : date.getDate()) + "/" + ((date.getMonth() + 1).toString().length == 1 ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1)) + "/" + date.getFullYear();
      return date
    }

    function getTime() {
      let date = new Date();
      date = (date.getDate().toString().length == 1 ? ("0" + date.getDate().toString()) : date.getDate()) + "/" + ((date.getMonth() + 1).toString().length == 1 ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1)) + "/" + date.getFullYear();
      return date
    }
    this.moveIndex = (arr, old_index, new_index) => {
      while (old_index < 0) {
          old_index += arr.length;
      }
      while (new_index < 0) {
          new_index += arr.length;
      }
      if (new_index >= arr.length) {
          var k = new_index - arr.length;
          while ((k--) + 1) {
              arr.push(undefined);
          }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);  
    return arr;
  }

    this.tableToExcel = (name, data) => {
      data = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1" cellspacing="0">'+ data +'</table></body></html>';
      let data1 = new Blob([data],{
        type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf8-8"
      });
      saveAs(data1,name+'.xls');
      // var uri = 'data:application/vnd.ms-excel;base64,',
      //   template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1" cellspacing="0">{table}</table></body></html>',
      //   base64 = function (s) {
      //     return window.btoa(unescape(encodeURIComponent(s)))
      //   },
      //   format = function (s, c) {
      //     return s.replace(/{(\w+)}/g, function (m, p) {
      //       return c[p];
      //     })
      //   };

      // var ctx = {
      //   worksheet: name || 'Worksheet',
      //   table: data
      // }
      // var link = document.createElement("a");
      // link.download = name + '.xls';
      // link.href = uri + base64(format(template, ctx));
      // link.click();
    };

  })
})();

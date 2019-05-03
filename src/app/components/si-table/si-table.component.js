(function () {
  "use strict";

  angular.module("MyApp").directive("siTable", function ($compile, ApiService) {
    return {
      scope: {
        dataTableConfig: "=config",
        ngModel: "=?",
        search: "=?",
        update: "=?",
        reloadTable: "=?"
      },

      controller: function ($rootScope, $scope, $element, $state, $location) {
        var tableInit;
        var resource = "";
        var fisrtLoad = true;
        var isHasVal = false;

        if ($location.$$search.filter == "close") {
          $scope.filter = "close";
          initFilter("close");
        } else {
          $scope.filter = "open";
          initFilter("open");
        }

        function initFilter(mode) {
          if (mode == "open") {
            if (
              !$($element)
              .find(".filter-region")
              .hasClass("show")
            ) {
              $($element)
                .find("[toggle-filter-btn]")
                .trigger("click");
            }
          } else {
            if (
              $($element)
              .find(".filter-region")
              .hasClass("show")
            ) {
              $($element)
                .find("[toggle-filter-btn]")
                .trigger("click");
            }
          }
        }

        function toggleTableFilter() {
          if ($scope.filter == "open") {
            $scope.filter = "close";
          } else {
            $scope.filter = "open";
          }
          updateQueryStringParam("filter", $scope.filter);
        }

        $($element)
          .find("[toggle-filter-btn]")
          .click(function () {
            toggleTableFilter();
          });

        function updateQueryStringParam(key, value) {

          $location.search(key, value).replace();
          $scope.$apply();

          // $location.$$search = Object.assign($location.$$search, {
          //   filter: value
          // });

          // if (typeof value != "undefined" && value != null && value != "") {
          //   var path = "";

          //   var urlQueryString = location.search;
          //   if (location.hash.startsWith("#!/")) {
          //     var queryIndex = location.hash.indexOf("?");
          //     if (queryIndex >= 0) {
          //       path = location.hash.substring(0, location.hash.indexOf("?"));
          //     }
          //     urlQueryString = location.hash.substring(
          //       location.hash.indexOf("?"),
          //       location.hash.length
          //     );
          //   }

          //   var baseUrl = [location.protocol, "//", location.host, location.pathname].join(
          //     ""
          //   ) + path;
          //   var newParam = key + "=" + value;
          //   var params = "?" + newParam;

          //   if (urlQueryString) {
          //     var updateRegex = new RegExp("([?&])" + key + "[^&]*");
          //     var removeRegex = new RegExp("([?&])" + key + "=[^&;]+[&;]?");
          //     if (typeof value == "undefined" || value == null || value == "") {
          //       // Remove param if value is empty
          //       params = urlQueryString.replace(removeRegex, "$1");
          //       params = params.replace(/[&;]$/, "");
          //     } else if (urlQueryString.match(updateRegex) !== null) {
          //       // If param exists already, update it
          //       params = urlQueryString.replace(updateRegex, "$1" + newParam);
          //     } else {
          //       // Otherwise, add it to end of query string
          //       params = urlQueryString + "&" + newParam;
          //     }
          //   }
          //   window.history.replaceState({}, "", baseUrl + params);
          // }
        }

        var pageSize = $location.search().limit ? $location.search().limit : 25;

        var page = parseInt($location.search().page);

        if (page <= 0 || isNaN(page)) {
          page = 1;
        }

        var displayStart = pageSize * (page - 1);

        $scope.currentPage = 0;

        $scope.ngModel = [];

        $scope.mode = "infinity";

        $scope.$watch("dataTableConfig", function (newVal) {
          if (newVal != undefined) {
            var defaultConfig = {
              ajax: function (data, callback, settings) {
                $scope.loading = true;
                if (($scope.mode = "infinity")) {
                  $scope.currentPage++;
                  var pageSize = $scope.dataTableConfig.pageLength ? $scope.dataTableConfig.pageLength : 25;
                } else {
                  var pageSize = settings._iDisplayLength;
                }

                // var pageNumber = (settings._iDisplayStart / pageSize) + 1;

                var sortType;
                var sortBy;

                if (settings.aaSorting.length > 0) {
                  var sortCol = settings.aaSorting[0][0];
                  sortType = settings.aaSorting[0][1];
                  sortBy = settings.aoColumns[sortCol].data;
                }

                var params = {
                  // page: $scope.currentPage,
                  limit: pageSize,
                  skip: ($scope.currentPage - 1) * pageSize
                };

                if (sortBy) {
                  params.sortBy = sortBy;
                  params.sortType = sortType;
                }

                if ($scope.dataTableConfig.params) {
                  $.each($scope.dataTableConfig.params, function (key, val) {
                    params[key] = val;
                  });
                }

                if (fisrtLoad) {
                  Object.assign(params, angular.copy($location.$$search));
                  $scope.search = angular.copy(params);
                  fisrtLoad = false;
                } else {
                  params = Object.assign({},
                    angular.copy($scope.search),
                    params
                  );
                  //Nếu có tham số filter thì lưu lại vào param (có thể xóa)
                  if ($location.$$search.filter) {
                    params.filter = $location.$$search.filter;
                  }
                }

                $.each($scope.search, function (key, val) {
                  if ($("#" + key).attr("multiple")) {
                    if (!Array.isArray(val)) {
                      $scope.search[key] = val.split("-");
                    }
                  }
                });

                //$scope.dataTableConfig.resource = resource;
                if ($scope.dataTableConfig.noPgnresource) {
                  resource = $scope.dataTableConfig.noPgnresource;
                }
                // used in case api returns just a list and not paginating
                else {
                  resource = $scope.dataTableConfig.resource;
                }

                // $.each(params, function (key, val) {
                //   if (Array.isArray(val)) {
                //     params[key] = val.join("-");
                //   }
                // });

                var objParams = Object.assign({}, params);

                // objParams.page = objParams.page - 1;

                let _searchTable = angular.copy(objParams);

                $scope.getTableData(objParams).then(
                  function (resp) {
                    $scope.loading = false;
                    var result = {};
                    if (resp.data) {
                      if (($scope.mode = "infinity")) {
                        if ($scope.currentPage > 1) {
                          resp.data = $scope.ngModel.concat(resp.data);
                        }

                        settings._iDisplayLength = resp.data.length;
                      }

                      $scope.ngModel = resp.data;

                      // $scope.$apply();

                      isHasVal = true;
                      result.data = resp.data;
                      result.recordsFiltered = resp.filteredCount;
                      result.recordsTotal = resp.filteredCount;
                    } else {
                      isHasVal = false;
                      result.data = [];
                      setTimeout(function () {
                        $($($element).find("table")[1])
                          .find(".select-checkbox")
                          .removeClass("select-checkbox");
                      }, 20);
                    }

                    callback(result);

                    $(".toggle-all")
                      .closest("tr")
                      .removeClass("selected");
                  },
                  function (error) {
                    //toastr.error(tableTitles.errorMessage);
                    $scope.loading = false;
                  }
                );

                if ($scope.mode == "infinity") {
                  $location.search(_.omit(params, ["limit", "page", "skip"]));
                } else {
                  $location.search(params);
                }
              },
              processing: true,
              serverSide: true,
              responsive: true,
              pageLength: pageSize,
              iDisplayStart: displayStart,
              lengthMenu: [25, 50, 100],
              order: [
                // [1, "asc"]
              ],
              language: {
                select: {
                  // rows: "%d bản ghi được chọn"
                },
                lengthMenu: "_MENU_",
                info: "Hiển thị _END_ trong tổng số _TOTAL_ bản ghi",
                infoEmpty: "",
                emptyTable: "Không có dữ liệu hiển thị",
                infoFiltered: "",
                zeroRecords: "Không có dữ liệu hiển thị",
                processing: '<img  src="/assets/images/Spinner-1s-200px.svg">',
                searching: false
                // paginate: {
                //   first: "Đầu",
                //   last: "Cuối",
                //   next: "Trang sau",
                //   previous: "Trang trước"
                // },
              },
              nameElementSuff: "-table",
              dom: "<'row'<'col-md-1 col-sm-1'><'col-md-11 col-sm-11'B<'table-group-actions pull-right'>>r>t<'row'<'col-md-5 col-sm-5 text-left'i><'col-md-7 col-sm-7 text-center'><'col-md-4 col-sm-12'>>",
              // dom: "<'row'<'col-md-12 col-sm-12'B<'table-group-actions pull-right'>>r>t<'row'<'col-md-1 col-sm-1 text-left'l><'col-md-5 col-sm-5 text-left'i><'col-md-6 col-sm-6 text-center'p><'col-md-4 col-sm-12'>>",
              bSort: true,
              scrollY: 450,
              // sScrollY: 'auto',
              buttons: []
            };

            if ($scope.dataTableConfig.selectRow != undefined) {
              if ($scope.dataTableConfig.selectRow == true) {
                $scope.dataTableConfig.select = {
                  style: "multiple",
                  selector: "td:first-child"
                };
              } else {
                $scope.dataTableConfig.select = false;
                defaultConfig.language.select.rows = "";
              }
            } else {
              $scope.dataTableConfig.select = {
                style: "multiple",
                selector: "td:first-child"
              };
            }

            $scope.getTableData = function (params) {
              return ApiService.GET($scope.dataTableConfig.requestUrl, params);
            };

            $scope.delete = function (e, id) {
              e.stopPropagation();

              swal.show(
                "confirm",
                translationsCrl.messageDeleteConfirm,
                "",
                function () {
                  var resourceDelete = resource;
                  while (resourceDelete.endsWith("/danh-sach")) {
                    resourceDelete = resourceDelete.replace(
                      new RegExp("/danh-sach$"),
                      "/xoa"
                    );
                  }
                  ApiService.customDELETE(
                    resourceDelete,
                    id,
                    translationsCrl.messageDeleteError
                  ).then(
                    function (success) {
                      toastr.success(translationsCrl.messageDeleteSuccess);
                      tableInit.draw();
                    },
                    function (error) {
                      // console.log(error);
                    }
                  );
                }
              );
            };

            $scope.dataTableConfig.columns.map(function (item, index) {
              item.defaultContent = "";
              if (item.sortable == undefined) {
                item.sortable = false;
              }

              //   if (item.customRender != true) {
              //     item.render = function (data, type, full, meta) {
              //         return data
              //       return _.escape(data);
              //     }
              //   }
            });

            // $scope.dataTableConfig.columns
            //   .filter(x => x.title == "STT")
            //   .map(function(item, index) {
            //     item.orderable = false;
            //     item.render = function(data, type, full, meta) {
            //       return meta.row + 1 + parseInt(meta.settings._iDisplayStart);
            //     };
            //   });

            $scope.dataTableConfig.columns
              .filter(x => x.type == "date")
              .map(function (item, index) {
                item.className = "text-center";
                item.render = function (data) {
                  if (data) {
                    return moment(data).format("DD/MM/YYYY");
                  } else {
                    return "";
                  }
                };
              });

            $scope.dataTableConfig.columns
              .filter(x => x.type == "datetime")
              .map(function (item, index) {
                item.className = "text-center";
                item.render = function (data) {
                  if (data) {
                    return moment(data).format("DD/MM/YYYY HH:MM:SS");
                  } else {
                    return "";
                  }
                };
              });

            $scope.dataTableConfig.columns
              .filter(x => x.type == "datetimehour")
              .map(function (item, index) {
                item.className = "text-center";
                item.render = function (data) {
                  if (data) {
                    return moment(data).format("DD/MM/YYYY HH:mm");
                  } else {
                    return "";
                  }
                };
              });

            // $scope.dataTableConfig.columns.map(function(el, idx) {
            //   if (!el.render) {
            //     el.render = function(data) {
            //       if (data && data.length > 60) {
            //         return data.substring(0, 60) + '...';
            //       }
            //       return data;
            //     }
            //   }
            // })

            if (
              typeof $scope.dataTableConfig.useAction != "undefined" &&
              $scope.dataTableConfig.useAction &&
              $scope.dataTableConfig.useAction.length > 0
            ) {
              if (window.innerWidth == 1024) {
                var width = 60;
                if (
                  $scope.dataTableConfig.useAction &&
                  $scope.dataTableConfig.useAction.length == 1
                ) {
                  width = 70;
                }
              } else {
                var width = 40;
                if (
                  $scope.dataTableConfig.useAction &&
                  $scope.dataTableConfig.useAction.length == 1
                ) {
                  width = 60;
                }
              }
              $scope.dataTableConfig.columns.push({
                data: "id",
                title: "Thao tác",
                bSortable: false,
                className: "text-center",
                width: width * $scope.dataTableConfig.useAction.length + "px",
                render: function (data, type, full, meta) {
                  var uiSrefBtnEditAction = "^.edit";
                  var uiSrefBtnEditObjParams = "";
                  if ($scope.dataTableConfig.uiSrefBtnEditAction) {
                    uiSrefBtnEditAction =
                      $scope.dataTableConfig.uiSrefBtnEditAction;
                  }
                  if ($scope.dataTableConfig.uiSrefBtnEditObjParams) {
                    uiSrefBtnEditObjParams =
                      $scope.dataTableConfig.uiSrefBtnEditObjParams;
                  }
                  var uiSrefBtnViewAction = "^.detail";
                  var uiSrefBtnViewObjParams = "";
                  if ($scope.dataTableConfig.uiSrefBtnViewAction) {
                    uiSrefBtnViewAction =
                      $scope.dataTableConfig.uiSrefBtnViewAction;
                  }
                  if ($scope.dataTableConfig.uiSrefBtnViewObjParams) {
                    uiSrefBtnViewObjParams =
                      $scope.dataTableConfig.uiSrefBtnViewObjParams;
                  }

                  var editButton = `<button class="btn btn-xs tooltipster" title="Sửa" ng-click="$event.stopPropagation()" ui-sref="${uiSrefBtnEditAction}({'id': ${data}${uiSrefBtnEditObjParams}})"><i class="fa fa-pencil"></i></button>`;
                  var deleteButton = `<button class="btn btn-xs tooltipster" title="Xóa" style="margin-right: 0" ng-click="delete($event, ${data})"><i class="fa fa-trash-o"></i></button>`;
                  var viewButton = `<button class="btn btn-xs tooltipster" title="Xem" ui-sref="${uiSrefBtnViewAction}({'id': ${data}${uiSrefBtnViewObjParams}})"><i class="fa fa-eye"></i></button>`;
                  var buttonList = "";
                  if ($scope.dataTableConfig.useAction.indexOf("view") > -1) {
                    buttonList += viewButton;
                  }

                  if ($scope.dataTableConfig.useAction.indexOf("edit") > -1) {
                    buttonList += editButton;
                  }
                  if ($scope.dataTableConfig.useAction.indexOf("delete") > -1) {
                    buttonList += deleteButton;
                  }
                  return buttonList;
                },
                fnCreatedCell: function (celContent, sData) {
                  $compile(celContent)($scope);
                }
              });
            }

            var config = Object.assign({},
              $scope.dataTableConfig,
              defaultConfig
            );

            config.initComplete = function (settings, json) {
              if (config.select) {
                setTimeout(() => {
                  $($element)
                    .find("table")
                    .find("th:eq(0)")
                    .addClass("toggle-all")
                    .append(`<i id="select_all" name="select_invoice"></i>`);
                }, 100);
              }
            };

            $scope.dataTableInstance = tableInit = initTable();

            function initTable() {
              let createdTable = $($element)
                .find("table")
                .DataTable(config)
                .on("select.dt deselect.dt", function (evtObj) {
                  var all = tableInit.rows().nodes().length;
                  var sel = tableInit.rows(".selected").nodes().length;

                  if (all === sel) {
                    $(".toggle-all")
                      .closest("tr")
                      .addClass("selected");
                  } else {
                    $(".toggle-all")
                      .closest("tr")
                      .removeClass("selected");
                  }
                })
                .on("length.dt", function (e, settings, len) {
                  //Gán pageNumber = 1;
                  settings._iDisplayStart = 0;
                })
                .on("draw", function (event, settings) {
                  if (settings.iDraw == 1) {
                    $scope.pageScrollPos = 0;
                    $($element)
                      .find(".dataTables_scrollBody")
                      .scroll(function (e) {
                        scrollHandle(e, settings);
                      });
                  }

                  $($element)
                    .find("div.dataTables_scrollBody")
                    .scrollTop($scope.pageScrollPos);
                });

              let scrollHandle = _.debounce(
                function (e, settings) {
                  var elem = $(e.currentTarget);
                  //Thực hiện loading dữ liệu trang tiếp theo khi scroll xuống dưới cùng cách bottom 100px
                  let currentScroll = Math.floor(
                    elem[0].scrollHeight - elem.scrollTop()
                  );
                  console.log(currentScroll + "_" + (elem.outerHeight() + 200));
                  if (currentScroll < elem.outerHeight() + 250) {
                    if (settings._iDisplayLength < settings._iRecordsTotal) {
                      $scope.pageScrollPos = $($element)
                        .find("div.dataTables_scrollBody")
                        .scrollTop();
                      if ($scope.loading == false) {
                        $scope.dataTableInstance.draw();
                      }
                    }
                  }
                },
                20, {
                  leading: true,
                  trailing: false
                }
              );

              // $($element)
              //   .find("table")
              //   .on("click", ".toggle-all", function() {
              //     $(this)
              //       .closest("tr")
              //       .toggleClass("selected");
              //     if (
              //       $(this)
              //         .closest("tr")
              //         .hasClass("selected")
              //     ) {
              //       tableInit.rows().select();
              //     } else {
              //       tableInit.rows().deselect();
              //     }
              //   });

              return createdTable;
            }
          }
        });

        // ve lai table
        $scope.$watch("reloadTable", function (newVal, oldValue) {
          if (newVal && newVal != oldValue) {
            if ($scope.mode == "infinity") {
              $scope.currentPage = 0;
              $scope.pageScrollPos = 0;
            }
            $scope.dataTableInstance.draw();

          }
        });

        /**
         * Thực hiện load dữ liệu khi click vào nút tiềm kiếm
         */
        $($element)
          .find("[search-btn]")
          .click(function () {
            if ($scope.mode == "infinity") {
              $scope.currentPage = 0;
              $scope.pageScrollPos = 0;
            }

            $scope.dataTableInstance.draw();
          });

        $($element).find(".filter-region .search_params").keyup(function (e) {
          if (e.keyCode == 13) {
            if ($scope.mode == "infinity") {
              $scope.currentPage = 0;
              $scope.pageScrollPos = 0;
            }
            $scope.dataTableInstance.draw();
          }
        });
        $($element).on('click', 'th', function () {
          $scope.currentPage = 0;
          $scope.pageScrollPos = 0;
        });

      },

      link: function ($scope, $element, $attrs, controller) {
        /**
         * Khởi bootstrap select cho các filter
         */
        $($element)
          .find(".filter-region .m-bootstrap-select")
          .selectpicker();

        $(document).on('scroll', function () {
          $('.tooltip').removeClass('show')
        });
      }
    };
  });
})();

(function () {
    "use strict";
  
    angular.module("MyApp").directive('jstree', function ($compile, $q, $state) {
      return {
        restrict: 'A',
        scope: {
          route: '@',
          getData: '&',
          nodeData: '=',
          eventNode: '&',
          level: '<',
          noAdd: '@',
          render: '@'
        },
        template: '',
        controller: function ($scope, $element, $state, Restangular, $rootScope) {
          this.restAngular = Restangular;
        },
  
        link: function ($scope, $element, controller, $attrs) {
          var render = $scope.getData({}).then(function (item) {
            $scope.data = item;
            if ($scope.noAdd == undefined) {
  
            }
            CreateTreeView($scope.data);
          })
  
          function CreateTreeView(data) {
  
            $element.jstree("destroy");
            var TreeView = $element
              .jstree({
                'core': {
                  "multiple": false,
                  'data': data,
  
                  'check_callback': function (o, n, p, i, m) {
  
                    if (m && m.dnd && m.pos !== 'i') {
                      return false;
                    }
                    if (o === "copy_node") {
                      this.get_node(n).text = "Bản sao " + this.get_node(n).text;
                    }
                    if (o === "move_node" || o === "copy_node") {
                      if (this.get_node(n).parent === this.get_node(p).id) {
                        return false;
                      }
                    }
  
                    return true;
                  },
                  'themes': {
  
                    'responsive': false,
                    'variant': 'large',
                    'stripes': false
  
                  }
                },
                'sort': function (a, b) {
                  return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(b) ? 1 : -1);
                },
                'contextmenu': {
                  'items': function ($node) {
  
  
                    if ($node.text != 'Root' && $scope.level) {
  
                      var config = {}
                      var nodeId = $node.id;
                      if ($scope.level != 1) {
                        config.Create = {
                          "separator_before": false,
                          "separator_after": false,
                          "label": "Thêm mới",
                          "action": function (data) {
                            if ($scope.nodeData.text == "Root") {
                              $scope.eventNode({
                                mode: 'them',
                                data: $scope.nodeData
                              });
                            }
                            if ($scope.curentLevel - 1 < $scope.level)
                              $scope.eventNode({
                                mode: 'them',
                                data: ""
                              });
                            else
  
                              swal("", "Không thể tạo danh mục cấp" + $scope.curentLevel, "error");
  
                          }
                        };
                      }
                      if ($node.original.isActive == true) {
                        config.action = {
                          "separator_before": false,
                          "separator_after": false,
                          "label": "Ẩn",
                          "action": function (obj) {
                            $scope.eventNode({
                              mode: 'an',
                              data: $scope.nodeData
                            });
                          }
                        }
                      } else {
                        config.action = {
  
                          "separator_before": false,
                          "separator_after": false,
                          "label": "Hiện",
                          "action": function (obj) {
                            $scope.eventNode({
                              mode: 'hien',
                              data: $scope.nodeData
                            });
                          }
  
                        }
                      }
  
                      config.delete = {
                        "separator_before": false,
                        "separator_after": false,
                        "label": "Xóa",
                        "action": function (obj) {
                          $scope.eventNode({
                            mode: 'xoa',
                            data: $scope.nodeData
                          });
                        }
                      }
                    }
  
                    return config;
  
                  }
                },
                'types': {
  
                  "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                  },
                  "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                  }
                },
                'unique': {
                  'duplicate': function (name, counter) {
                    return name + ' ' + counter;
                  }
                },
                "state": {
                  "key": "danhmucsanpham"
                },
  
                'plugins': ['types', 'unique', 'state', 'dnd', 'contextmenu']
  
              }).bind({
                element: $element
              });
            TreeView.on('delete_node.jstree', function (e, data) {
  
              swal("", "Xóa danh mục thành công", "info");
            })
  
            TreeView.on('create_node.jstree', function (e, data) {
  
              $.get('?operation=create_node', {
                  'type': data.node.type,
                  'id': data.node.parent,
                  'text': data.node.text
                })
                .done(function (d) {
                  data.instance.set_id(data.node, d.id);
                })
                .fail(function () {
                  data.instance.refresh();
                });
            })
            TreeView.on('rename_node.jstree', function (e, data) {
              swal("", "Đổi tên thành công", "info");
            })
            TreeView.on('move_node.jstree', function (e, data) {
              let mode = 'move';
  
              $scope.eventNode({
                mode: mode,
                data: data
              });
            })
            TreeView.on('copy_node.jstree', function (e, data) {
              $state.reload();
            })
            TreeView.on('paste.jstree', function (e, data) {
              if (data.mode == "copy_node") {
                swal("", "Thực hiện sao chép danh mục", "info");
              }
  
              if (data.mode == "move_node") {
                swal("", "Thực hiện di chuyển danh mục", "info");
              }
            })
            TreeView.on('select_node.jstree', function (e, data) {
  
              var item = data.node.original;
              $scope.curentLevel = data.node.parents.length;
              if (item.name == "Root") {
                $scope.nodeData = data.node;
                $scope.nodeData.level = $scope.curentLevel = 1;
                $scope.eventNode({
                  mode: 'them',
                  data: $scope.nodeData
                });
  
              } else {
                $scope.nodeData = data.node.original;
                $scope.nodeData.level = $scope.curentLevel;
                $scope.eventNode({
                  mode: 'chitiet',
                  data: $scope.nodeData
                });
              }
            });
            TreeView.on('changed.jstree', function (e, data) {
  
            })
            TreeView.on("redraw.jstree", function (e, data) {
              var selector = $element;
              var root = $(selector).jstree(true).get_node("root_anchor")
            })
          }
          render;
        }
      }
    });
  })();
  
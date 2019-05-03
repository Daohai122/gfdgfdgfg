deferredBootstrapper.bootstrap({
  element: document,
  module: "MyApp",
  // injectorModules: "Auth",
  resolve: {
    APP_CONFIG: function ($http, $q) {
      // Khai báo menu tương ứng với api trả về,
      // title không trả về thì sẽ lấy title mặc định
      //  link được cấu hình trong route trùng với link trả về trên admin,
      //  menu cha thì không có state

      let menuItems = [{
          state: "home",
          title: "Trang chủ"
        },
        {
          title: "Trung tâm",
          mega: true,
          children: [{
              title: "Trung tâm",
              children: [{
                  title: "Danh sách trung tâm",
                  state: "admin.center.list",
                  permissions: ["Center.View"]
                },
                {
                  title: "Thêm mới trung tâm",
                  state: "admin.center.add",
                  permissions: ["Center.Create"]
                }
              ]
            },
            {
              title: "Khóa học",
              children: [{
                  title: "Danh sách khóa học",
                  state: "admin.batch.list",
                  permissions: ["Batch.View"]
                },
                {
                  title: "Thêm mới khóa học",
                  state: "admin.batch.add",
                  permissions: ["Batch.Create"]
                }
              ]
            },
            {
              title: "Ngành học",
              children: [{
                  title: "Danh sách ngành học",
                  state: "admin.studyfield.list",
                  permissions: ["StudyField.View"]
                },
                {
                  title: "Thêm mới ngành học",
                  state: "admin.studyfield.add",
                  permissions: ["StudyField.Create"]
                }
              ]
            }
          ]
        },
        {
          title: "Người dùng",
          children: [{
              title: "Danh sách người dùng",
              state: "admin.user.list",
              permissions: ["User.View"]
            },
            {
              title: "Thêm mới người dùng",
              state: "admin.user.add",
              permissions: ["User.Create"]
            }
          ]
        },
        {
          title: "Dự án",
          children: [{
              title: "Danh sách dự án",
              state: "admin.project.list",
              permissions: ["Project.View"]
            },
            {
              title: "Thêm mới dự án",
              state: "admin.project.add",
              permissions: ["Project.Create"]
            }
          ]
        },
        {
          title: "Doanh nghiệp",
          mega: true,
          children: [{
              title: "Doanh nghiệp",
              children: [{
                  title: "Danh sách doanh nghiệp",
                  state: "admin.company.list",
                  permissions: ["Company.View"]
                },
                {
                  title: "Thêm mới doanh nghiệp",
                  state: "admin.company.add",
                  permissions: ["Company.Create"]
                }
              ]
            },
            {
              title: "Đối tác",
              children: [{
                  title: "Danh sách đối tác",
                  state: "admin.partner.list",
                  permissions: ["Partner.View"]
                },
                {
                  title: "Thêm mới đối tác",
                  state: "admin.partner.add",
                  permissions: ["Partner.Create"]
                }
              ]
            },
            {
              title: "truyền thông",
              children: [{
                  title: "Danh sách truyền thông",
                  state: "admin.media.list",
                  permissions: ["Media.View"]
                },
                {
                  title: "Thêm mới truyền thông",
                  state: "admin.media.add",
                  permissions: ["Media.Create"]
                }
              ]
            }
          ]
        },
        {
          title: "Học viên",
          children: [{
              title: "Danh sách học viên",
              state: "admin.student.list",
              permissions: ["Student.View"]
            },
            {
              title: "Thêm mới học viên",
              state: "admin.student.add",
              permissions: ["Student.Create"]
            }
          ]
        },
        {
          title: "Báo cáo",
          children: [{
              title: "Báo cáo tổng quát",
              state: "admin.report_all",
              permissions: ["ReportSystem.View"],
            },
            {
              title: "Báo cáo theo trung tâm",
              state: "admin.center_report",
              permissions: ["ReportCenter.View"],
            },
          ]
        },
        {
          title: "Cấu hình",
          children: [{
              title: "Phân quyền",
              state: "admin.permission",
              permissions: ["Setting.Create"]
            },
            // {
            //   title: "Liên kết tham khảo",
            //   state: "admin.contact_mobile",
            //   permissions: ["Setting.Create"]
            // },
            // {
            //   title: "Điều khoản",
            //   state: "admin.setting.term",
            //   permissions: ["Setting.Create"]
            // }
          ]
        }
      ];

      let appMenuItems = [{
          state: "home",
          title: "Trang chủ"
        },
        {
          title: "Nội dung",
          children: [{
              title: "Bài viết",
              state: "admin.article.list",
              permissions: ["Article.View"]
            },
            {
              title: "Danh mục",
              state: "admin.categories.list",
              permissions: ["ArticleCategory.View"]
            },
            {
              title: "Bình luận",
              state: "admin.comment.listNew",
              permissions: ["Comment.View"]
            }
          ]
        },
        {
          title: "Quản lý người dùng mobile",
          children: [{
              title: "Danh sách người dùng",
              state: "admin.userMobile.list",
              permissions: ["User.View"]
            },
            {
              title: "Nhóm người dùng",
              state: "admin.user_group.list",
              permissions: ["User.View"]
            }
          ]
        },
        {
          title: "Quản lý công việc",
          state: "admin.job.list",
          permissions: ["Job.View"]
        },
        {
          title: "Quản lý feedback",
          state: "admin.feedback.list",
          permissions: ["Feedback.View"]
        },
        {
          title: "Liên kết tham khảo",
          state: "admin.contact_mobile",
          permissions: ["Setting.Create"]
        },
        {
          title: "Điều khoản",
          state: "admin.setting.term",
          permissions: ["Setting.Create"]
        },
      ];



      return new Promise(resolve => {
        resolve({
          menuItems: menuItems,
          appMenuItems: appMenuItems
        });
      });
    }

  }
});

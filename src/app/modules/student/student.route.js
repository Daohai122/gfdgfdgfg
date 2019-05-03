(function () {
	'use strict';
	angular
	.module('MyApp')
	.config(function routerConfig($stateProvider) {
		$stateProvider
		.state("admin.student", {
			url: "/student",
			abtract: true,
			template: "<div ui-view></div>",
		}).state("admin.student.list", {
			url: "/list/",
			title: "Danh sách học viên",
			templateUrl: "/app/modules/student/list.student.html",
			controller: "List.Student.Controller",
		}).state("admin.student.detail", {
			url: "/detail/:id?mode",
			title: "Chi tiết học viên",
			templateUrl: "/app/modules/student/detail/detail.student.html",
			controller: "Detail.Student.Controller",
	        reloadOnSearch: false,
		}).state("admin.student.detail.info", {
			url: "/info",
			title: "Chi tiết học viên",
			templateUrl: "/app/modules/student/info/info.student.html",
			controller: "Info.Student.Controller",
	        reloadOnSearch: false,
		}).state("admin.student.detail.me", {
			url: "/me",
			title: "Chi tiết học viên",
			templateUrl: "/app/modules/student/me/me.student.html",
			controller: "Me.Student.Controller",
	        reloadOnSearch: false,
		}).state("admin.student.detail.intern", {
			url: "/intern",
			title: "Chi tiết học viên",
			templateUrl: "/app/modules/student/intern/intern.student.html",
			controller: "Intern.Student.Controller",
	        reloadOnSearch: false,
		}).state("admin.student.detail.job", {
			url: "/job",
			title: "Chi tiết học viên",
			templateUrl: "/app/modules/student/job/job.student.html",
			controller: "Job.Student.Controller",
	        reloadOnSearch: false,
		}).state("admin.student.detail.survey", {
			url: "/survey",
			title: "Chi tiết học viên",
			templateUrl: "/app/modules/student/survey/survey.student.html",
			controller: "Survey.Student.Controller",
	        reloadOnSearch: false,
		}).state("admin.student.add", {
			url: "/add",
			templateUrl: "/app/modules/student/add.student.html",
			controller: "Add.Student.Controller",
			title: "Thêm học viên"
		})
	});
})();

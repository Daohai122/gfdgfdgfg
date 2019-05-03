(function () {
	"use strict";
	angular
	.module("MyApp")
	.controller("Notification.Controller", function ($state, $scope, ApiService) {

		$scope.init = () => {

			setTimeout(() => {
				$scope.getNotification('view');
				$scope.countUnreadNoti();
			}, 5000);

		}

		$scope.dataNotification = [];
		$scope.notiLimit = 0;

		$scope.getNotification = function (mode) {
			if (mode == 'more') {
				$scope.notiLimit++;
			}
			ApiService.GET("notifications?limit=25&skip=" + $scope.notiLimit * 25).then(res => {
				res.data.map(function (el, idx) {
					var createdTime = new Date(el.notification.creationTime);
					var now = new Date();
					if (now.getDate() - createdTime.getDate() <= 1) {
						if (now.getDate() - createdTime.getDate() == 0) {
							if (now.getHours() == createdTime.getHours()) {
								if (now.getMinutes() - createdTime.getMinutes() >= 1) {
									el.offsetTime = now.getMinutes() - createdTime.getMinutes() + ' phút trước';
								} else {
									el.offsetTime = 'Vừa xong';
								}
							} else if (now.getHours() < createdTime.getHours()) {
								el.offsetTime = (24 - createdTime.getHours()) + now.getHours() + ' giờ trước';
							} else {
								el.offsetTime = now.getHours() - createdTime.getHours() + ' giờ trước';
							}
						} else {
							el.offsetTime = '1 ngày trước';
						}
					} else if (now.getDate() - createdTime.getDate() > 1 && now.getDate() - createdTime.getDate() <= 7) {
						el.offsetTime = now.getDate() - createdTime.getDate() + ' ngày trước';
					} else {
						var date = createdTime.getDate().toString().length == 1 ? '0' + createdTime.getDate() : createdTime.getDate();
						var month = createdTime.getMonth() + 1;
						month = month.toString().length == 1 ? '0' + month : month;
						el.offsetTime = date + ' / ' + month + ' / ' + createdTime.getFullYear();
					}
				})
				$scope.dataNotification = $scope.dataNotification.concat(res.data);
				$scope.$apply();
			})
		}

		$scope.countUnreadNoti = function () {
			ApiService.GET("notifications/CountNotificationUnReadByUserId/" + $scope.dataMyinfomation.id).then(res => {
				$scope.countUnread = res;
				if ($scope.countUnread) {
					setInterval(function () {
						$('#m_topbar_notification_icon .m-nav__link-icon').addClass('m-animate-shake');
						$('#m_topbar_notification_icon .m-nav__link-badge').addClass('m-animate-blink');
					}, 3000);

					setInterval(function () {
						$('#m_topbar_notification_icon .m-nav__link-icon').removeClass('m-animate-shake');
						$('#m_topbar_notification_icon .m-nav__link-badge').removeClass('m-animate-blink');
					}, 6000);
				}
			})
		}

		$scope.clickNotification = (el) => {
			if (el.state == 0) {
				var data = {
					notificationIds: [el.id]
				};
				ApiService.PUT("notifications/MarkAsRead", data).then(res => {
					$scope.getNotification('view');
					$scope.countUnreadNoti();
				})
			}

			notiHandler[el.notification.notificationName](el.notification.data.properties.Info);

			$('.m-topbar__notifications').removeClass('m-dropdown--open')
		}

		let notiUserCreated = (info) => {
			$state.go('admin.user.edit', {id: info.Id});
		}

		let notiCommentReply = (info) => {
			$state.go('admin.comment.listNew', {articleId: info.ArticleId})
		}

		let notiCommentCreated = (info) => {
			$state.go('admin.comment.listNew', {articleId: info.ArticleId})
		}

		let notiArticleCreated = (info) => {
			$state.go('admin.article.edit', {id: info.Id});
		}

		let notiStudentCreated = (info) => {
			$state.go('admin.student.detail.info', {id: info.Id});
		}

		let notiAlumniCheckJob = (info) => {
			$state.go('admin.job.list');
		}

		let notiHandler = {
			"user.created": notiUserCreated,
			"comment.reply": notiCommentCreated,
			"comment.created": notiCommentReply,
			"article.created": notiArticleCreated,
			"student.created": notiStudentCreated,
			"alumni.checkJob": notiAlumniCheckJob,
		};

		$scope.readAllNoti = () => {
			ApiService.GET("notifications/MarkAllReadByCurrentUser").then(res => {
				$scope.dataNotification = [];
				$scope.notiLimit = 0;
				$scope.getNotification('view');
				$scope.countUnreadNoti();
			})
		}

		$scope.init()

	});
})();

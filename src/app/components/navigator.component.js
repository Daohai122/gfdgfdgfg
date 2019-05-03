(function () {
	'use strict';
	angular
	.module('MyApp')
	.directive('navigator', function () {
		return {
			restrict: "AE",
        // transclude: true,
        link: function postLink(scope, element, $timeout, attrs, ctrl) {

	        // Navigation on hover event
	        setTimeout(function () {
	        	$('.m-header__bottom .m-menu__item').hover(function(event) {
	        		let menuItemWidth = 250;
	        		let megaMenuWidth = 0;
	        		let cursorOffset = event.currentTarget.offsetLeft;
	        		if ($(this).find('.m-submenu__mega-menu').length > 0) {
	        			let megaMenuItemCount = $(this).find('.m-submenu__mega-menu').find('.m-submenu__mega-item').length;
	        			megaMenuWidth = menuItemWidth * megaMenuItemCount;
	        		} else {
	        			megaMenuWidth = menuItemWidth;
	        		}
	        		if (cursorOffset + megaMenuWidth > window.innerWidth) {
	        			$(this).find('.m-menu__submenu').removeClass('m-menu__submenu--left');
	        			$(this).find('.m-menu__submenu').addClass('m-menu__submenu--right');
	        		} else {
	        			$(this).find('.m-menu__submenu').addClass('m-menu__submenu--left');
	        			$(this).find('.m-menu__submenu').removeClass('m-menu__submenu--right');
	        		}
	        		$(this).find('.m-menu__submenu').addClass('m-submenu__on');
	        	}, function(event) {
	        		$(this).find('.m-menu__submenu').removeClass('m-submenu__on');
	        	});
	        }, 1000)


          // Navigation on click event

          // let selectedItem;

          // $('.m-menu__item').click(function(event) {
          //   if (selectedItem && this != selectedItem) {
          //     selectedItem = this;
          //     $('.m-menu__item').find('.m-menu__submenu').removeClass('m-submenu__on');
          //     $(this).find('.m-menu__submenu').addClass('m-submenu__on');
          //   } else {
          //     selectedItem = this;
          //     $(this).find('.m-menu__submenu').toggleClass('m-submenu__on');
          //   }
          // });

          // $(window).click(function(event) {
          //   if ($('.m-menu__item').find('.m-menu__submenu').hasClass('m-submenu__on')) {
          //         if ($(event.target).closest('.m-menu__item').length == 0) {
          //             $('.m-menu__item').find('.m-menu__submenu').removeClass('m-submenu__on');
          //         }
          //     }
          // })
      },
      controller: function ($scope, ) {

      }
  }
});
})();

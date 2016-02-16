(function() {
	'use strict';

	angular.module('app', [
		// Angular module
		'ngSanitize',

		// Third party module
		'ui.router',
		'ui.bootstrap',
		'xeditable',
		'cgBusy',

		// App Module
		'app.home'
	])
	.config(configRoute)
	.run(appRun);

	function configRoute($urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/home');
		$locationProvider.html5Mode(true);
	};

	function appRun($rootScope, $window) {
		console.log("appRun ");
		startScrollListener($rootScope);
	}

	function startScrollListener($rootScope) {
		var docElem = document.documentElement,
			didScroll = false,
			changeHeaderOn = 300;

		window.addEventListener( 'scroll', function( event ) {
			if (!didScroll) {
				didScroll = true;
				setTimeout(scrollPage, 250);
			}
		}, false);

		function scrollPage() {
			var sy = scrollY();
			if (sy >= 300) {
				$rootScope.$apply(function() {
					$rootScope.showNavbar = true;
				});
			} else {
				$rootScope.$apply(function() {
					$rootScope.showNavbar = false;
				});
			}
			didScroll = false;
		}

		function scrollY() {
			return window.pageYOffset || docElem.scrollTop;
		}
	}

})();

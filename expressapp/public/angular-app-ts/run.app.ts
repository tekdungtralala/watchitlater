/// <reference path="../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	declare var window: AppWindow;

	function appRun($rootScope: AppRootScope, $http: ng.IHttpService, myAccountSrvc: IMyAccountSrvc) {
		
		runSNSListener();
		startScrollListener();
		
		function startScrollListener(): void {
			var docElem = document.documentElement;
			var didScroll = false;
			var changeHeaderOn = 300;

			window.addEventListener('scroll', function(event) {
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

		function runSNSListener() {
			// google signin
			window.gapi.load('auth2', function() {
				window.auth2 = window.gapi.auth2.init({
					client_id: '282630936768-vh37jnihfbm59s8jmkrr4eu7hl577r8r.apps.googleusercontent.com',
					cookiepolicy: 'single_host_origin'
				});

				myAccountSrvc.runListener();
			});
		}
	}

	angular.module('app').run(appRun);
}
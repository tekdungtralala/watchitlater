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
		'duScroll',
		'oc.lazyLoad',

		// App Module
		'app.home',
		'app.top-movie',
		'app.core'
	])
	.config(configRoute)
	.run(appRun);

	function configRoute($urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/home');
		$locationProvider.html5Mode(true);
	};

	function appRun($rootScope, $window, homeservice) {
		startScrollListener();
		loadGoogleAPI();

		$rootScope.loggedUser = {};
		$rootScope.loggedUser.fullName = null;
		$rootScope.loggedUser.email = null;

		function loadGoogleAPI() {
			gapi.load('auth2', function() {
				window.auth2 = gapi.auth2.init({
					client_id: '282630936768-vh37jnihfbm59s8jmkrr4eu7hl577r8r.apps.googleusercontent.com',
					cookiepolicy: 'single_host_origin'
				});
				// placed in home.html
				window.auth2.attachClickHandler(document.getElementById('google-signin-btn1'));
				window.auth2.isSignedIn.listen(googleSignedListener);

				function googleSignedListener(isLogged) {
					var profile = window.auth2.currentUser.get().getBasicProfile();
					var data = {
						email: profile.getEmail(),
						socialNetwok: {
							fullName: profile.getName(),
							id: profile.getId(),
							imageUrl: profile.getImageUrl(),
							type: profile.getEmail()
						}
					};

					homeservice.postSignIn(data)

					if (isLogged) {
						$rootScope.$apply(function() {
							$rootScope.loggedUser.fullName = data.socialNetwok.fullName;
							$rootScope.loggedUser.email = data.email;
						});
					}
				}

			});
		}

		function startScrollListener() {
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
	}

	function testSignOut() {
		// auth2.signOut().then(function() {
		// 	console.log('User signed out.');
		// });
	}

})();

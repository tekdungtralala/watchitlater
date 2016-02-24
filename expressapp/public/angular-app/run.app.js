(function() {
	'use strict';

	angular.module('app').run(appRun);
	function appRun($rootScope, $window, $http) {
		startScrollListener();
		loadGoogleAPI();

		$rootScope.loggedUser = {};
		$rootScope.loggedUser.fullName = null;
		$rootScope.loggedUser.email = null;

		function loadGoogleAPI() {
			if (window.gapi) {
				window.gapi.load('auth2', function() {
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

						postSignIn(data);

						if (isLogged) {
							$rootScope.$apply(function() {
								$rootScope.loggedUser.fullName = data.socialNetwok.fullName;
								$rootScope.loggedUser.email = data.email;
							});
						} else {
							$rootScope.$apply(function() {
								$rootScope.loggedUser = {};
							});
						}
					}
				});
			}

			function postSignIn(data) {
				var req = {
					method: 'POST',
					url: '/api/signin',
					headers: {
						'Content-Type': 'application/json'
					},
					data: data
				};

				return $http(req);
			}
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
})();

var angularApp;
(function (angularApp) {
    "use strict";
    function appRun($rootScope, $http) {
        runSNSListener();
        startScrollListener();
        function startScrollListener() {
            var docElem = document.documentElement;
            var didScroll = false;
            var changeHeaderOn = 300;
            window.addEventListener('scroll', function (event) {
                if (!didScroll) {
                    didScroll = true;
                    setTimeout(scrollPage, 250);
                }
            }, false);
            function scrollPage() {
                var sy = scrollY();
                if (sy >= 300) {
                    $rootScope.$apply(function () {
                        $rootScope.showNavbar = true;
                    });
                }
                else {
                    $rootScope.$apply(function () {
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
            window.gapi.load('auth2', function () {
                window.auth2 = window.gapi.auth2.init({
                    client_id: '282630936768-vh37jnihfbm59s8jmkrr4eu7hl577r8r.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin'
                });
                window.auth2.isSignedIn.listen(function (isSigin) {
                    $rootScope.loggedUser = null;
                    if (isSigin) {
                        var profile = window.auth2.currentUser.get().getBasicProfile();
                        var data = {
                            email: profile.getEmail(),
                            socialNetwok: {
                                fullName: profile.getName(),
                                id: profile.getId(),
                                imageUrl: profile.getImageUrl(),
                                type: 'GOOGLE'
                            }
                        };
                        postUserSignIn(data);
                        $rootScope.loggedUser = {
                            fullName: data.socialNetwok.fullName,
                            email: data.email
                        };
                    }
                });
            });
        }
        function postUserSignIn(data) {
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
    angular.module('app').run(appRun);
})(angularApp || (angularApp = {}));

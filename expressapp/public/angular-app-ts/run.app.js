var angularApp;
(function (angularApp) {
    "use strict";
    function appRun($rootScope) {
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
    }
    angular.module('app').run(appRun);
})(angularApp || (angularApp = {}));

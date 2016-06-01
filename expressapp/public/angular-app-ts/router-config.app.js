var angularApp;
(function (angularApp) {
    "use strict";
    function routerConfig($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/angular-app/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm',
            resolve: {
                loadCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['homeservice', 'HomeCtrl'], { serie: true });
                }
            }
        })
            .state('top-movie', {
            url: '/top-movie',
            templateUrl: '/angular-app/topmovie/topmovie.html',
            controller: 'TopMovieCtrl',
            controllerAs: 'vm',
            resolve: {
                loadCtrl: function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['homeservice', 'TopMovieCtrl'], { serie: true });
                }
            }
        });
    }
    angular.module('app').config(routerConfig);
})(angularApp || (angularApp = {}));

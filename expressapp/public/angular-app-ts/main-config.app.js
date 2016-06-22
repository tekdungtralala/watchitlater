var angularApp;
(function (angularApp) {
    "use strict";
    function configuration($urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {
        $urlRouterProvider.otherwise('/home');
        $locationProvider.html5Mode(true);
        var modules = [{
                name: 'HomeCtrl',
                files: ['/angular-app-ts/home/home.controller.js']
            }, {
                name: 'TopMovieCtrl',
                files: ['/angular-app-ts/topmovie/topmovie.controller.js']
            }, {
                name: 'BoxOfficeCtrl',
                files: ['/angular-app-ts/boxoffice/boxoffice.controller.js']
            }, {
                name: 'MovieDetailCtrl',
                files: ['/angular-app-ts/home/movieDetail.controller.js']
            }, {
                name: 'MyAccountCtrl',
                files: ['/angular-app-ts/myaccount/myaccount.ctrl.js']
            }, {
                name: 'BookMarkCtrl',
                files: ['/angular-app-ts/myaccount/bookmark/bookmark.ctrl.js']
            }, {
                name: 'SettingCtrl',
                files: ['/angular-app-ts/myaccount/setting/setting.ctrl.js']
            }, {
                name: 'homeservice',
                files: ['/angular-app-ts/service/home.service.js']
            }, {
                name: 'boxOfficeSrvc',
                files: ['/angular-app-ts/service/boxoffice.service.js']
            }];
        $ocLazyLoadProvider.config({ modules: modules });
    }
    angular.module('app').config(configuration);
})(angularApp || (angularApp = {}));

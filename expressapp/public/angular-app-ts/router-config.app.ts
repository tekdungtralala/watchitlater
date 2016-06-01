/// <reference path="../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	function routerConfig($stateProvider: angular.ui.IStateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/angular-app/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm',
            resolve: {
                loadCtrl: function ($ocLazyLoad: oc.ILazyLoad) {
                    return $ocLazyLoad.load(['homeservice', 'HomeCtrl'], {serie: true});
                }
            }
        })
        .state('top-movie', {
            url: '/top-movie',
            templateUrl: '/angular-app/topmovie/topmovie.html',
            controller: 'TopMovieCtrl',
            controllerAs: 'vm',
            resolve: {
                loadCtrl: function($ocLazyLoad: oc.ILazyLoad) {
                    return $ocLazyLoad.load(['homeservice', 'TopMovieCtrl'], {serie: true});
                }
            }
        })
        .state('box-office', {
            url: '/box-office?date',
            templateUrl: '/angular-app/boxoffice/boxoffice.html',
            controller: 'BoxOfficeCtrl',
            controllerAs: 'vm',
            resolve: {
                loadCtrl: function($ocLazyLoad: oc.ILazyLoad) {
                    return $ocLazyLoad.load(['boxOfficeSrvc', 'homeservice', 'BoxOfficeCtrl'], {serie: true});
                }
            }
        });
	}

	angular.module('app').config(routerConfig);
}
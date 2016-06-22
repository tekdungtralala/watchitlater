/// <reference path="../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	function routerConfig($stateProvider: angular.ui.IStateProvider) {
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/angular-app-ts/home/home.html',
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
			templateUrl: '/angular-app-ts/topmovie/topmovie.html',
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
			templateUrl: '/angular-app-ts/boxoffice/boxoffice.html',
			controller: 'BoxOfficeCtrl',
			controllerAs: 'vm',
			resolve: {
				loadCtrl: function($ocLazyLoad: oc.ILazyLoad) {
					return $ocLazyLoad.load(['boxOfficeSrvc', 'homeservice', 'BoxOfficeCtrl'], {serie: true});
				}
			}
		})
		.state('my-account', {
			url: '/my-account',
			templateUrl: '/angular-app-ts/myaccount/myaccount.html',
			controller: 'MyAccountCtrl',
			controllerAs: 'vm',
			resolve: {
				loadCtrl: function($ocLazyLoad: oc.ILazyLoad) {
					return $ocLazyLoad.load(['MyAccountCtrl'], {serie: true});
				}
			}
		})
		.state('my-account.bookmark', {
			templateUrl: '/angular-app-ts/myaccount/bookmark/bookmark.html',
			controller: 'BookMarkCtrl',
			controllerAs: 'vm',
			resolve: {
				loadCtrl: function($ocLazyLoad: oc.ILazyLoad) {
					return $ocLazyLoad.load(['BookMarkCtrl'], {serie: true});
				}
			}
		})
		.state('my-account.setting', {
			url: '/setting',
			templateUrl: '/angular-app-ts/myaccount/setting/setting.html',
			controller: 'SettingCtrl',
			controllerAs: 'vm',
			resolve: {
				loadCtrl: function($ocLazyLoad: oc.ILazyLoad) {
					return $ocLazyLoad.load(['SettingCtrl'], {serie: true});
				}
			}
		})
		;
	}

	angular.module('app').config(routerConfig);
}
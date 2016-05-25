/// <reference path="../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	function configuration(
		$urlRouterProvider: angular.ui.IUrlRouterProvider, 
		$locationProvider: angular.ILocationProvider,
		$ocLazyLoadProvider: oc.ILazyLoadProvider) {

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
			name: 'homeservice',
			files: ['/angular-app-ts/service/home.service.js']
		}, {
			name: 'boxOfficeSrvc',
			files: ['/angular-app-ts/service/boxoffice.service.js']
		}];
		
		$ocLazyLoadProvider.config({ modules: modules });
	}

	angular.module('app').config(configuration);
}
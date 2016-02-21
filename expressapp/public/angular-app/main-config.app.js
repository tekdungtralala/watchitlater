(function() {
	'use strict';

	angular.module('app').config(configuration);

	function configuration($urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {
		$urlRouterProvider.otherwise('/home');
		$locationProvider.html5Mode(true);

		var modules = [{
			name: 'HomeCtrl',
			files: ['/angular-app/home/home.controller.js']
		}, {
			name: 'TopMovieCtrl',
			files: ['/angular-app/topmovie/topmovie.controller.js']
		}, {
			name: 'BoxOfficeCtrl',
			files: ['/angular-app/boxoffice/boxoffice.controller.js']
		}, {
			name: 'MovieDetailCtrl',
			files: ['/angular-app/home/movieDetail.controller.js']
		}, {
			name: 'homeservice',
			files: ['/angular-app/service/home.service.js']
		}];

		$ocLazyLoadProvider.config({ modules: modules });
	};

})();

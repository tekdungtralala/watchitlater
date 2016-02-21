(function() {
	'use strict';

	angular.module('app').config(routerConfig);

	function routerConfig($stateProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/angular-app/home/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm',
				resolve: {
					loadCtrl: function($ocLazyLoad) {
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
					loadCtrl: function($ocLazyLoad) {
						return $ocLazyLoad.load(['homeservice', 'TopMovieCtrl'], {serie: true});
					}
				}
			})
			.state('box-office', {
				url: '/box-office',
				templateUrl: '/angular-app/boxoffice/boxoffice.html',
				controller: 'BoxOfficeCtrl',
				controllerAs: 'vm',
				resolve: {
					loadCtrl: function($ocLazyLoad) {
						return $ocLazyLoad.load(['boxOfficeSrvc', 'homeservice', 'BoxOfficeCtrl'], {serie: true});
					}
				}
			});
	};

})();

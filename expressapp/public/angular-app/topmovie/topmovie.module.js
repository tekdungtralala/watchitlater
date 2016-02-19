(function() {
	'use strict';

	angular
		.module('app.top-movie', [])
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state('top-movie', {
				url: '/top-movie',
				templateUrl: '/angular-app/topmovie/topmovie.html',
				controller: 'TopMovieCtrl',
				controllerAs: 'vm',
				resolve: { loadCtrl: loadCtrl }
			});
	}

	function loadCtrl($ocLazyLoad) {
		return $ocLazyLoad.load('/angular-app/topmovie/topmovie.controller.js');
	}

})();

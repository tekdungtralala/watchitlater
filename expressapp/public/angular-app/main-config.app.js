(function() {
	'use strict';

	angular.module('app').config(configuration);

	function configuration($urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {
		$urlRouterProvider.otherwise('/home');
		$locationProvider.html5Mode(true);

		var modules = [{
			name: 'HomeCtrl',
			files: [generateLocation('/angular-app/home/home.controller.js')]
		}, {
			name: 'TopMovieCtrl',
			files: [generateLocation('/angular-app/topmovie/topmovie.controller.js')]
		}, {
			name: 'BoxOfficeCtrl',
			files: [generateLocation('/angular-app/boxoffice/boxoffice.controller.js')]
		}, {
			name: 'MovieDetailCtrl',
			files: [generateLocation('/angular-app/home/movieDetail.controller.js')]
		}, {
			name: 'homeservice',
			files: [generateLocation('/angular-app/service/home.service.js')]
		}, {
			name: 'boxOfficeSrvc',
			files: [generateLocation('/angular-app/service/boxoffice.service.js')]
		}];

		$ocLazyLoadProvider.config({ modules: modules });

		function generateLocation(destPath) {
			if (window.isProd) {
					var arr = destPath.split('angular-app');
					var newPath = arr[0] + 'angular-app-build' + arr[1];
					return newPath.replace('.js', '.min.js');
			}
			return destPath;
		}
	};

})();

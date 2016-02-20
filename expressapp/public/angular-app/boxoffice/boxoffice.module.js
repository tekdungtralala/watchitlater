(function() {
	'use strict';

	angular
		.module('app.box-office', [])
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state('box-office', {
				url: '/box-office',
				templateUrl: '/angular-app/boxoffice/boxoffice.html',
				controller: 'BoxOfficeCtrl',
				controllerAs: 'vm',
				resolve: { loadCtrl: loadCtrl }
			});
	}

	function loadCtrl($ocLazyLoad) {
		return $ocLazyLoad.load('/angular-app/boxoffice/boxoffice.controller.js');
	}

})();

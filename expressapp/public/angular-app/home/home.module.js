(function() {
	'use strict';

	angular
		.module('app.home', [])
		.config(configRoute);

	function configRoute($stateProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/angular-app/home/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'vm'
			});
	}

})();

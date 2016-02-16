(function() {
	'use strict';

	angular.module('app', [

		// Angular module
		'ngSanitize',

		// Third party module
		'ui.router',
		'ui.bootstrap',
		'xeditable',
		'cgBusy',

		// App Module
		'app.home'
	])
	.config(configRoute)
	.run(appRun);

	function configRoute($urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/home');
		$locationProvider.html5Mode(true);
	};

	function appRun() {
		console.log("appRun");
	}

})();

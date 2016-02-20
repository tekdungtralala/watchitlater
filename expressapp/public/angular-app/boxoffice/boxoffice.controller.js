(function() {
	'use strict';

	angular
		.module('app.box-office')
		.controller('BoxOfficeCtrl', BoxOfficeCtrl);

	function BoxOfficeCtrl($scope, homeservice) {
		console.log('box-office ctrl');
	}

})();

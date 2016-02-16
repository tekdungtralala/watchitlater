(function() {
	'use strict';

	angular
		.module('app.home')
		.controller('HomeCtrl', HomeCtrl);

	function HomeCtrl($document) {
		var vm = this;

		vm.scrollToElmt = scrollToElmt;

		function scrollToElmt(elmtId) {
			$document.scrollToElementAnimated(angular.element(document.getElementById(elmtId)), 0, 700);
		}
	}

})();

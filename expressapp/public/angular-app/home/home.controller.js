(function() {
	'use strict';

	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);

	function HomeCtrl($rootScope, $scope, $document, homeservice) {
		var vm = this;
		var movieList = [];
		vm.listTM = [];
		vm.listBO = [];

		vm.scrollToElmt = scrollToElmt;
		vm.viewMovieDetail = viewMovieDetail;

		activate();
		function activate() {
			var promise = [homeservice.getLatestBoxOffice(), homeservice.getLatestTopMovie()];
			homeservice.ready(promise).then(afterGetResult);
		}

		function viewMovieDetail(movieId) {
			homeservice.showMovieDetail(movieList, movieId);
		}

		function afterGetResult(result) {
			afterGetLatestBO(result[0]);
			afterGetLatestTM(result[1]);
		}

		function afterGetLatestTM(result) {
			vm.listTM = _.slice(result, 0, 5);
			addToMovieList(vm.listTM);
		}

		function afterGetLatestBO(result) {
			vm.listBO[0] = _.slice(result, 0, 3);
			addToMovieList(vm.listBO[0]);
			vm.listBO[1] = _.slice(result, 3, 6);
			addToMovieList(vm.listBO[1]);
			vm.listBO[2] = _.slice(result, 6, 9);
			addToMovieList(vm.listBO[2]);
		}

		function addToMovieList(result) {
			_.forEach(result, function(d) {
				movieList.push(d);
			});
		}

		function scrollToElmt(elmtId) {
			$document.scrollToElementAnimated(angular.element(document.getElementById(elmtId)), 0, 700);
		}
	}

})();

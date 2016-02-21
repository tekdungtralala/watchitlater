(function() {
	'use strict';

	angular
		.module('app')
		.controller('TopMovieCtrl', TopMovieCtrl);

	function TopMovieCtrl($scope, homeservice) {
		var vm = this;
		// vm.listMovie = [];
		vm.showMovieDetail = showMovieDetail;

		activate();
		function activate() {
			homeservice
				.getLatestTopMovie(0, 300)
				.then(afterGetData);
		}

		function showMovieDetail(movieId) {
			homeservice.showMovieDetail(vm.listMovie, movieId);
		}

		function afterGetData(result) {
			_.orderBy(result, ['imdbRating'], ['desc']);
			vm.listMovie = result;
		}
	}

})();

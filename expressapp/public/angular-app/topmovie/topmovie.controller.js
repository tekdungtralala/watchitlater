(function() {
	'use strict';

	angular
		.module('app.top-movie')
		.controller('TopMovieCtrl', TopMovieCtrl);

	function TopMovieCtrl($scope, homeservice) {
		var vm = this;
		// vm.listMovie = [];

		activate();
		function activate() {
			homeservice
				.getLatestTopMovie(0, 300)
				.then(afterGetData);
		}

		function afterGetData(result) {
			_.orderBy(result, ['imdbRating'], ['desc']);
			vm.listMovie = result;
		}
	}

})();

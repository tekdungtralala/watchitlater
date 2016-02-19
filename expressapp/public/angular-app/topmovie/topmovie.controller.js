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
			vm.listMovie = result;
			_.orderBy(vm.listMovie, ['imdbRating'], ['desc']);
			console.log(vm.listMovie[0])
		}
	}

})();

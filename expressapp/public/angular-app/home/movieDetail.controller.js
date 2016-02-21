(function() {
	'use strict';

	angular
		.module('app')
		.controller('MovieDetailCtrl', MovieDetailCtrl);

	function MovieDetailCtrl($uibModalInstance, movieList, movieId) {
		var vm = this;
		vm.selectedMovie = null;
		vm.prevMovie = null;
		vm.nextMovie = null;
		vm.findMovie = findMovie;
		vm.closeDialog = closeDialog;

		activate();
		function activate() {
			findMovie(movieId);
		};

		function closeDialog() {
			$uibModalInstance.dismiss('cancel');
		}

		function findMovie(movieId) {
			var prev;
			var next;
			var index;

			_.forEach(movieList, function(d, i) {
				if (movieId === d.imdbID) {
					vm.selectedMovie = d;
					index = i;
				}
			});

			prev = index - 1;
			next = index + 1;

			prev = (prev === -1) ? movieList.length - 1 : prev;
			next = (next >= movieList.length) ? 0 : next;

			vm.prevMovie = movieList[prev];
			vm.nextMovie = movieList[next];
		};
	}

})();

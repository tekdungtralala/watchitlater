(function() {
	'use strict';

	angular
		.module('app.home')
		.controller('HomeCtrl', HomeCtrl);

	function HomeCtrl($rootScope, $scope, $document, $uibModal, homeservice) {
		var vm = this;
		var modalInstance = null;
		var movieList = [];
		vm.listTM = [];
		vm.listBO = [];
		vm.selectedMovie = null;
		vm.prevMovie = null;
		vm.nextMovie = null;
		vm.isLogged = false;

		vm.scrollToElmt = scrollToElmt;
		vm.viewMovieDetail = viewMovieDetail;
		vm.closeDialog = closeDialog;

		activate();
		function activate() {
			var promise = [homeservice.getLatestBoxOffice(), homeservice.getLatestTopMovie()];
			homeservice.ready(promise).then(afterGetResult);		
		}

		function viewMovieDetail(movieId) {
			closeDialog();
			findMovie(movieId);
			modalInstance = $uibModal.open({
				templateUrl: 'movieDetail.html',
				scope: $scope,
				size: 'lg',
				backdrop: 'static'
			});

			modalInstance.rendered.then(function() {
				if (auth2 && auth2.attachClickHandler)
					window.auth2.attachClickHandler(document.getElementById('google-signin-btn2'));
			});
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
		}

		function closeDialog() {
			if (modalInstance && modalInstance.dismiss)
				modalInstance.dismiss();
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

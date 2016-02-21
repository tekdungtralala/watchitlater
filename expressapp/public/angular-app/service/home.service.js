(function() {

	'use strict';

	angular
		.module('app')
		.factory('homeservice', Homeservice);

	function Homeservice($q, $http, $uibModal, $ocLazyLoad) {
		var isPrimed = false;
		var primePromise;

		var service = {
			ready: ready,
			getLatestBoxOffice: getLatestBoxOffice,
			getLatestTopMovie: getLatestTopMovie,
			showMovieDetail: showMovieDetail
		};

		return service;

		function showMovieDetail(movieList, movieId) {
			$uibModal.open({
				templateUrl: 'angular-app/home/movieDetail.html',
				controller: 'MovieDetailCtrl',
				controllerAs: 'vm',
				size: 'lg',
				backdrop: 'static',
				resolve: {
					movieList: getMovieList,
					loadMovieDetailCtrl: loadMovieDetailCtrl,
					movieId: function() {
						return movieId;
					}
				}
			})
			.rendered.then(function() {
				if (window.auth2 && window.auth2.attachClickHandler)
					window.auth2.attachClickHandler(document.getElementById('google-signin-btn2'));
			});

			function getMovieList() {
				return movieList;
			}

			function loadMovieDetailCtrl() {
				return $ocLazyLoad.load('MovieDetailCtrl');
			}
		}

		function getLatestTopMovie(skip, limit) {
			var l = limit ? limit : 5;
			var s = skip ? skip : 0;
			var apiUrl = '/api/getLatestTopMovie?skip=' + skip + '&limit=' + limit;
			return $http.get(apiUrl).then(getData);
		}

		function getLatestBoxOffice() {
			var apiUrl = '/api/weeklymovie';
			return $http.get(apiUrl).then(getData);
		}

		function ready(nextPromises) {
			var readyPromise = primePromise || prime();

			return readyPromise
				.then(function() { return $q.all(nextPromises); })
				.catch();
		}

		function prime() {
			// This function can only be called once.
			if (primePromise) {
				return primePromise;
			}

			primePromise = $q.when(true).then(success);
			return primePromise;

			function success() {
				isPrimed = true;
			}
		}

		function getData(result) {
			return result.data;
		}
	}

})();

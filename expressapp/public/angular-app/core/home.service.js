(function() {

	'use strict';

	angular
		.module('app.core')
		.factory('homeservice', Homeservice);

	function Homeservice($q, $http) {
		var isPrimed = false;
		var primePromise;

		var service = {
			ready: ready,
			getLatestBoxOffice: getLatestBoxOffice,
			getLatestTopMovie: getLatestTopMovie,
			postSignIn: postSignIn
		};

		return service;

		function postSignIn(data) {
			var req = {
				method: 'POST',
				url: '/api/signin',
				headers: {
					'Content-Type': 'application/json'
				},
				data: data
			};

			return $http(req);
		}

		function getLatestTopMovie(skip, limit) {
			var l = limit ? limit : 5;
			var s = skip ? skip : 0;
			var apiUrl = '/api/getLatestTopMovie?skip=' + skip + '&limit=' + limit;
			return $http.get(apiUrl).then(getData);
		}

		function getLatestBoxOffice() {
			var apiUrl = '/api/getLatestBoxOffice';
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

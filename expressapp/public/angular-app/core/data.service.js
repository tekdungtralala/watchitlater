(function() {

	'use strict';

	angular
		.module('app.core')
		.factory('dataservice', Dataservice);

	function Dataservice($q, $http) {
		var isPrimed = false;
		var primePromise;

		var service = {
			ready: ready,
			getLatestBoxOffice: getLatestBoxOffice(),
			getLatestTopMovie: getLatestTopMovie()
		};

		return service;

		function getLatestTopMovie() {
			var apiUrl = '/api/getLatestTopMovie'
			return $http.get(apiUrl).then(getData);
		}

		function getLatestBoxOffice() {
			var apiUrl = '/api/getLatestBoxOffice'
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

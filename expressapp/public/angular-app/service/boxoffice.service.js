(function() {

	'use strict';

	angular
		.module('app')
		.factory('boxOfficeSrvc', boxOfficeSrvc);

	function boxOfficeSrvc($http) {
		var service = {
			getWeeklymovie: getWeeklymovie,
			postWeeklymovie: postWeeklymovie
		};
		return service;

		function postWeeklymovie(date) {
			var apiUrl = '/api/weeklymovie?date=' + date;
			var req = {
				method: 'POST',
				url: apiUrl,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			return $http(req).then(getData);
		}

		function getWeeklymovie(date) {
			var apiUrl = '/api/weeklymovie?date=' + date;
			return $http.get(apiUrl).then(getData);
		}

		function getData(result) {
			return result.data;
		}
	}

})();

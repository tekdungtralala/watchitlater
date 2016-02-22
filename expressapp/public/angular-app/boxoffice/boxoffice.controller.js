(function() {
	'use strict';

	angular
		.module('app')
		.controller('BoxOfficeCtrl', BoxOfficeCtrl);

	function BoxOfficeCtrl($scope, boxOfficeSrvc, homeservice) {
		var vm = this;
		var rangeMap = [
			{firstRange: -2, lastRange: 4},
			{firstRange: -3, lastRange: 3},
			{firstRange: -4, lastRange: 2},
			{firstRange: -5, lastRange: 1},
			{firstRange: -6, lastRange: 0},
			{firstRange: 0, lastRange: 6},
			{firstRange: 1, lastRange: 5}
		];
		vm.maxDate = new Date();
		vm.selectedDate = new Date();
		vm.minDate = null;
		vm.dateInfo = null;
		vm.movieList = [];
		vm.takeMoreTime = false;

		vm.changedDate = changedDate;
		vm.dateChanged = dateChanged;
		vm.showMovieDetail = showMovieDetail;

		activate();
		function activate() {
			dateChanged();

			vm.minDate = moment('2005-1-1', 'YYYY-MM-DD')._d;
		}

		function showMovieDetail(movieId) {
			homeservice.showMovieDetail(vm.movieList, movieId);
		}

		function dateChanged() {
			var dr = getDateRange();
			vm.dateInfo = moment(dr.fdow).format('MMM D') + ' - ' + moment(dr.ldow).format('MMM D');
			updateMovieList();
		}

		function updateMovieList() {
			var date = moment(vm.selectedDate).format('YYYY-MM-DD');
			vm.movieList = null;
			boxOfficeSrvc
				.getWeeklymovie(date)
				.then(afterGetData);
		}

		function afterGetData(result) {
			vm.movieList = result;
			if (_.isEmpty(result)) {
				var date = moment(vm.selectedDate).format('YYYY-MM-DD');
				vm.movieList = null;
				vm.takeMoreTime = true;
				boxOfficeSrvc
					.postWeeklymovie(date)
					.then(afterPostData);
			}
		}

		function afterPostData(result) {
			vm.movieList = result;
			vm.takeMoreTime = false;
		}

		function changedDate(newDate) {
			vm.selectedDate = moment(vm.selectedDate).add(newDate, 'day')._d;
			dateChanged();
		}

		function getDateRange() {
			var dayInWeek = vm.selectedDate.getDay();
			var rm = rangeMap[dayInWeek];
			var firstDayOfWeek = moment(vm.selectedDate).add(rm.firstRange, 'day')._d;
			var lastDayOfWeek = moment(vm.selectedDate).add(rm.lastRange, 'day')._d;
			return {
				fdow: firstDayOfWeek.setHours(0, 0, 0, 0),
				ldow: lastDayOfWeek.setHours(0, 0, 0, 0)
			};
		}

		$scope.getDayClass = function(date, mode) {
			if (mode === 'day') {
				var dr = getDateRange();
				var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
				if (dr.fdow <= dayToCheck && dayToCheck <= dr.ldow) {
					return 'in-same-week';
				};

				return '';
			}
		};
	}

})();

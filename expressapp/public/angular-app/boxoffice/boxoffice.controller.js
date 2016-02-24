(function() {
	'use strict';

	angular
		.module('app')
		.controller('BoxOfficeCtrl', BoxOfficeCtrl);

	function BoxOfficeCtrl($scope, $stateParams, $state, boxOfficeSrvc, homeservice) {
		var vm = this;
		var DATE_FORMAT = 'YYYY-M-D';
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
		vm.disabledPrevBtn = false;
		vm.disabledNextBtn = false;

		vm.changeWeek = changeWeek;
		vm.dateChanged = dateChanged;
		vm.showMovieDetail = showMovieDetail;

		activate();
		function activate() {
			vm.minDate = moment('2005-1-1', DATE_FORMAT);

			var date = moment($stateParams.date, DATE_FORMAT, true);
			if (!date.isValid()) {
				$state.go('box-office', {date: moment(new Date()).format(DATE_FORMAT)}, {reload: true});
			} else {
				vm.selectedDate = date._d;
				updateMovieList(moment(vm.selectedDate).format(DATE_FORMAT));
			}
		}

		function showMovieDetail(movieId) {
			homeservice.showMovieDetail(vm.movieList, movieId);
		}

		function dateChanged() {
			$state.go('box-office', {date: moment(vm.selectedDate).format(DATE_FORMAT)}, {reload: true});
		}

		function changeWeek(newDate) {
			vm.selectedDate = moment(vm.selectedDate).add(newDate, 'day')._d;
			dateChanged();
		}

		function updateMovieList(dateStr) {
			vm.disabledPrevBtn = true;
			vm.disabledNextBtn = true;

			var dr = getDateRange();
			vm.dateInfo = moment(dr.fdow).format('MMM D') + ' - ' + moment(dr.ldow).format('MMM D');

			vm.movieList = null;
			boxOfficeSrvc
				.getWeeklymovie(dateStr)
				.then(afterGetData);
		}

		function updateNextPrevBtn() {
			vm.disabledPrevBtn = moment(getDateRange().fdow).add(-1, 'day').diff(vm.minDate, 'day') <= 0;;
			vm.disabledNextBtn = moment(getDateRange().ldow).add(1, 'day').diff(moment(new Date()), 'day') >= 0;
		}

		function afterGetData(result) {
			vm.movieList = result;
			updateNextPrevBtn();
			if (_.isEmpty(result)) {
				vm.disabledPrevBtn = true;
				vm.disabledNextBtn = true;
				var date = moment(vm.selectedDate).format(DATE_FORMAT);
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
			updateNextPrevBtn();
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

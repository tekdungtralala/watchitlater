/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";
	
	interface CtrlParam extends angular.ui.IStateService {
		date: string
	}
	
	class RangeMap {
		firstRange: number
		lastRange: number
	}
	
	class DateRange {
		fdow: number
		ldow: number
	}
 
	class BoxOfficeCtrl {
		static $inject = ["boxOfficeSrvc", "homeservice", "$stateParams", "$state"];

		private DATE_FORMAT: string = 'YYYY-M-D'
		private rangeMap: Array<RangeMap> = [
			{firstRange: -2, lastRange: 4},
			{firstRange: -3, lastRange: 3},
			{firstRange: -4, lastRange: 2},
			{firstRange: -5, lastRange: 1},
			{firstRange: -6, lastRange: 0},
			{firstRange: 0, lastRange: 6},
			{firstRange: 1, lastRange: 5}
		];
		private maxDate: Date = new Date();
		private selectedDate: Date = new Date();
		private minDate: moment.Moment = null;
		private dateInfo: string = null;
		private movieList: Movie[];
		private takeMoreTime: boolean = false;
		private disabledPrevBtn: boolean = false;
		private disabledNextBtn: boolean = false;
		
		constructor (
			private boxOfficeSrvc: IBoxOfficeSrvc,
			private homeservice: IHomeService,
			private $stateParams: CtrlParam,
			private $state: angular.ui.IStateService) {
			this.minDate = moment('2005-1-1', this.DATE_FORMAT);
			
			let date: moment.Moment = moment(
				this.$stateParams.date, this.DATE_FORMAT, true);

			if (!date.isValid()) {
				$state.go('box-office', {date: moment(new Date()).format(this.DATE_FORMAT)}, {reload: true});
			} else {
				this.selectedDate = date.toDate();
				this.updateMovieList(moment(this.selectedDate).format(this.DATE_FORMAT));
			}
		}
		
		showMovieDetail = (movieId: string) => {
			this.homeservice.showMovieDetail(this.movieList, movieId);
		}
		
		dateChanged = (): void => {
			this.$state.go('box-office', {date: moment(this.selectedDate).format(this.DATE_FORMAT)}, {reload: true});
		}
		
		changeWeek = (newDate: string): void => {
			this.selectedDate = moment(this.selectedDate).add(newDate, 'day').toDate();
			this.dateChanged();
		}
		
		updateMovieList = (dateStr: string): void => {
			this.disabledPrevBtn = true;
			this.disabledNextBtn = true;
			
			let dr: DateRange = this.getDateRange();
			this.dateInfo = moment(dr.fdow).format('MMM D') + ' - ' + moment(dr.ldow).format('MMM D');
			
			this.movieList = null;
			this.boxOfficeSrvc
				.getWeeklymovie(dateStr)
				.then(this.afterGetData)
		}
		
		updateNextPrevBtn = (): void => {
			this.disabledPrevBtn = moment(this.getDateRange().fdow).add(-1, 'day').diff(this.minDate, 'day') <= 0;;
			this.disabledNextBtn = moment(this.getDateRange().ldow).add(1, 'day').diff(moment(new Date()), 'day') >= 0;
		}
		
		afterGetData = (result: Movie[]): void => {
			this.movieList = result;
			this.updateNextPrevBtn();
			if (_.isEmpty(result)) {
				this.disabledNextBtn = true;
				this.disabledPrevBtn = true;
				let date: string = moment(this.selectedDate).format(this.DATE_FORMAT);
				this.movieList = null;
				this.takeMoreTime = true;
				this.boxOfficeSrvc
					.postWeeklymovie(date)
					.then(this.afterPostData);
			}
		}
		
		afterPostData = (result: Movie[]): void => {
			this.movieList = result;
			this.takeMoreTime = false;
			this.updateNextPrevBtn();
		}
		
		getDateRange = (): DateRange => {
			let dayInWeek: number = this.selectedDate.getDay();
			let rm: RangeMap = this.rangeMap[dayInWeek];
			let firstDayOfWeek: Date = moment(this.selectedDate).add(rm.firstRange, 'day').toDate();
			let lastDayOfWeek: Date = moment(this.selectedDate).add(rm.lastRange, 'day').toDate();
			return {
				fdow: firstDayOfWeek.setHours(0, 0, 0, 0),
				ldow: lastDayOfWeek.setHours(0, 0, 0, 0)
			};
		}
	}

	angular
		.module('app')
		.controller('BoxOfficeCtrl', BoxOfficeCtrl);
}
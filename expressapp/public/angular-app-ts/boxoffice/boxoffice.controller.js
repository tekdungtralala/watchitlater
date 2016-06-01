var angularApp;
(function (angularApp) {
    "use strict";
    var RangeMap = (function () {
        function RangeMap() {
        }
        return RangeMap;
    }());
    var DateRange = (function () {
        function DateRange() {
        }
        return DateRange;
    }());
    var BoxOfficeCtrl = (function () {
        function BoxOfficeCtrl(boxOfficeSrvc, homeservice, $stateParams, $state) {
            var _this = this;
            this.boxOfficeSrvc = boxOfficeSrvc;
            this.homeservice = homeservice;
            this.$stateParams = $stateParams;
            this.$state = $state;
            this.DATE_FORMAT = 'YYYY-M-D';
            this.rangeMap = [
                { firstRange: -2, lastRange: 4 },
                { firstRange: -3, lastRange: 3 },
                { firstRange: -4, lastRange: 2 },
                { firstRange: -5, lastRange: 1 },
                { firstRange: -6, lastRange: 0 },
                { firstRange: 0, lastRange: 6 },
                { firstRange: 1, lastRange: 5 }
            ];
            this.maxDate = new Date();
            this.selectedDate = new Date();
            this.minDate = null;
            this.dateInfo = null;
            this.takeMoreTime = false;
            this.disabledPrevBtn = false;
            this.disabledNextBtn = false;
            this.showMovieDetail = function (movieId) {
                _this.homeservice.showMovieDetail(_this.movieList, movieId);
            };
            this.dateChanged = function () {
                _this.$state.go('box-office', { date: moment(_this.selectedDate).format(_this.DATE_FORMAT) }, { reload: true });
            };
            this.changeWeek = function (newDate) {
                _this.selectedDate = moment(_this.selectedDate).add(newDate, 'day').toDate();
                _this.dateChanged();
            };
            this.updateMovieList = function (dateStr) {
                _this.disabledPrevBtn = true;
                _this.disabledNextBtn = true;
                var dr = _this.getDateRange();
                _this.dateInfo = moment(dr.fdow).format('MMM D') + ' - ' + moment(dr.ldow).format('MMM D');
                _this.movieList = null;
                _this.boxOfficeSrvc
                    .getWeeklymovie(dateStr)
                    .then(_this.afterGetData);
            };
            this.updateNextPrevBtn = function () {
                _this.disabledPrevBtn = moment(_this.getDateRange().fdow).add(-1, 'day').diff(_this.minDate, 'day') <= 0;
                ;
                _this.disabledNextBtn = moment(_this.getDateRange().ldow).add(1, 'day').diff(moment(new Date()), 'day') >= 0;
            };
            this.afterGetData = function (result) {
                _this.movieList = result;
                _this.updateNextPrevBtn();
                if (_.isEmpty(result)) {
                    _this.disabledNextBtn = true;
                    _this.disabledPrevBtn = true;
                    var date = moment(_this.selectedDate).format(_this.DATE_FORMAT);
                    _this.movieList = null;
                    _this.takeMoreTime = true;
                    _this.boxOfficeSrvc
                        .postWeeklymovie(date)
                        .then(_this.afterPostData);
                }
            };
            this.afterPostData = function (result) {
                _this.movieList = result;
                _this.takeMoreTime = false;
                _this.updateNextPrevBtn();
            };
            this.getDateRange = function () {
                var dayInWeek = _this.selectedDate.getDay();
                var rm = _this.rangeMap[dayInWeek];
                var firstDayOfWeek = moment(_this.selectedDate).add(rm.firstRange, 'day').toDate();
                var lastDayOfWeek = moment(_this.selectedDate).add(rm.lastRange, 'day').toDate();
                return {
                    fdow: firstDayOfWeek.setHours(0, 0, 0, 0),
                    ldow: lastDayOfWeek.setHours(0, 0, 0, 0)
                };
            };
            this.minDate = moment('2005-1-1', this.DATE_FORMAT);
            var date = moment(this.$stateParams.date, this.DATE_FORMAT, true);
            if (!date.isValid()) {
                $state.go('box-office', { date: moment(new Date()).format(this.DATE_FORMAT) }, { reload: true });
            }
            else {
                this.selectedDate = date.toDate();
                this.updateMovieList(moment(this.selectedDate).format(this.DATE_FORMAT));
            }
        }
        BoxOfficeCtrl.$inject = ["boxOfficeSrvc", "homeservice", "$stateParams", "$state"];
        return BoxOfficeCtrl;
    }());
    angular
        .module('app')
        .controller('BoxOfficeCtrl', BoxOfficeCtrl);
})(angularApp || (angularApp = {}));

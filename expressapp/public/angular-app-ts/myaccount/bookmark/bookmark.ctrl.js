var angularApp;
(function (angularApp) {
    "use strict";
    var BookMarkCtrl = (function () {
        function BookMarkCtrl(bookmarkSrvc, homeService, myAccountSrvc, $state, $uibModal, $scope) {
            var _this = this;
            this.bookmarkSrvc = bookmarkSrvc;
            this.homeService = homeService;
            this.myAccountSrvc = myAccountSrvc;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.$scope = $scope;
            this.showBookmarkLoading = true;
            this.showWatchedLoading = true;
            this.watchedOpened = false;
            this.selectedMovie = null;
            this.movies = [];
            this.watchedMovies = [];
            this.orderBookmarkBy = '-imdbRating';
            this.orderWatchedBy = '-imdbRating';
            this.activate = function () {
                _this.showBookmarkLoading = false;
                _this.bookmarkSrvc.getBookmarkMovies().then(_this.afterGetBookmarkMovies);
                if (_this.watchedOpened) {
                    _this.updateWatchedMovies();
                }
            };
            this.reloadData = function () {
            };
            this.toggleWatchedElmt = function (newValue) {
                if (newValue) {
                    _this.updateWatchedMovies();
                }
            };
            this.updateWatchedMovies = function () {
                _this.showWatchedLoading = true;
                _this.bookmarkSrvc.getWatchedMovies().then(_this.afterGetWatchedMovies);
            };
            this.afterGetBookmarkMovies = function (movies) {
                _this.movies = movies;
                _this.addRealeasedTimestamp(_this.movies);
            };
            this.addRealeasedTimestamp = function (movies) {
                _.forEach(movies, function (m) {
                    m.releasedTimestamp = Number(moment(m.Released, "DD MMM YYYY").format('X'));
                });
            };
            this.afterGetWatchedMovies = function (movies) {
                _this.showWatchedLoading = false;
                _this.watchedMovies = movies;
                _this.addRealeasedTimestamp(_this.watchedMovies);
            };
            this.showMovieDetail = function (movieId, listMovies) {
                _this.homeService.showMovieDetail(listMovies, movieId, _this.bookmarkChangeCB);
            };
            this.bookmarkChangeCB = function () {
                _this.activate();
            };
            this.preAddTowatched = function (movie) {
                _this.selectedMovie = movie;
                var t = _this;
                _this.modalInstance = _this.$uibModal.open({
                    animation: true,
                    templateUrl: 'watchedConfirm.html',
                    scope: t.$scope,
                    backdrop: 'static'
                });
            };
            this.doAddWatched = function () {
                _this.doCancel();
                _this.bookmarkSrvc.addToWatched(_this.selectedMovie.imdbID).then(_this.activate);
            };
            this.preUnBookmark = function (movie) {
                _this.selectedMovie = movie;
                var t = _this;
                _this.modalInstance = _this.$uibModal.open({
                    animation: true,
                    templateUrl: 'unbookmarkConfirm.html',
                    scope: t.$scope,
                    backdrop: 'static'
                });
            };
            this.doUnbookmark = function () {
                _this.doCancel();
                _this.bookmarkSrvc.removeFromBookmark(_this.selectedMovie.imdbID).then(_this.activate);
            };
            this.doCancel = function () {
                if (_this.modalInstance && _this.modalInstance.dismiss)
                    _this.modalInstance.dismiss();
            };
            this.moveToBookmark = function (movieId) {
                _this.bookmarkSrvc.addToBookmark(movieId).then(_this.activate);
            };
            this.sortBookmarkData = function (newVal) {
                _this.orderBookmarkBy = ('-' + newVal) === _this.orderBookmarkBy ? ('+' + newVal) : ('-' + newVal);
            };
            this.sortWatchedData = function (newVal) {
                _this.orderWatchedBy = ('-' + newVal) === _this.orderWatchedBy ? ('+' + newVal) : ('-' + newVal);
            };
            myAccountSrvc.hasLoggedUser()
                .then(this.activate)
                .catch(function () {
                $state.go('home');
            });
            $scope.$watch('vm.watchedOpened', this.toggleWatchedElmt);
        }
        BookMarkCtrl.$inject = ['bookmarkSrvc', 'homeservice', 'myAccountSrvc', '$state', '$uibModal', '$scope'];
        return BookMarkCtrl;
    }());
    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
})(angularApp || (angularApp = {}));

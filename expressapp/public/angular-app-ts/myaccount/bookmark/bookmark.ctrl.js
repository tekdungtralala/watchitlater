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
            this.activate = function () {
                _this.showBookmarkLoading = false;
                _this.bookmarkSrvc.getBookmarkMovies().then(_this.afterGetBookmarkMovies);
                if (_this.watchedOpened) {
                    _this.updateWatchedMovies();
                }
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
            };
            this.afterGetWatchedMovies = function (movies) {
                _this.showWatchedLoading = false;
                _this.watchedMovies = movies;
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

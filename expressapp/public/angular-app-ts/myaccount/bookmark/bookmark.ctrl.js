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
            this.showLoading = true;
            this.selectedMovieId = null;
            this.movies = [];
            this.activate = function () {
                _this.showLoading = false;
                _this.bookmarkSrvc.getBookmarkMovies().then(_this.afterGetMovies);
            };
            this.afterGetMovies = function (movies) {
                _this.movies = _.clone(movies);
                _.forEach(_this.movies, function (m) {
                    m.showInBookmark = true;
                });
            };
            this.showMovieDetail = function (movieId) {
                _this.homeService.showMovieDetail(_this.movies, movieId, _this.bookmarkChangeCB);
            };
            this.bookmarkChangeCB = function () {
                _this.activate();
            };
            this.preUnbookmark = function (movieId) {
                _this.selectedMovieId = movieId;
                var t = _this;
                _this.modalInstance = _this.$uibModal.open({
                    animation: true,
                    templateUrl: 'watchedConfirm.html',
                    size: 'sm',
                    scope: t.$scope,
                    backdrop: 'static'
                });
            };
            this.doWatched = function (movieId) {
                _this.doCancel();
                _this.bookmarkSrvc.addToWatched(_this.selectedMovieId).then(_this.activate);
            };
            this.doCancel = function () {
                if (_this.modalInstance && _this.modalInstance.dismiss)
                    _this.modalInstance.dismiss();
            };
            myAccountSrvc.hasLoggedUser()
                .then(this.activate)
                .catch(function () {
                $state.go('home');
            });
        }
        BookMarkCtrl.$inject = ['bookmarkSrvc', 'homeservice', 'myAccountSrvc', '$state', '$uibModal', '$scope'];
        return BookMarkCtrl;
    }());
    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
})(angularApp || (angularApp = {}));

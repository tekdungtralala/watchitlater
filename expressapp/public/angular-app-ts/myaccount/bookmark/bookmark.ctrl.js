var angularApp;
(function (angularApp) {
    "use strict";
    var BookMarkCtrl = (function () {
        function BookMarkCtrl(bookmarkSrvc, homeService, myAccountSrvc, $state) {
            var _this = this;
            this.bookmarkSrvc = bookmarkSrvc;
            this.homeService = homeService;
            this.myAccountSrvc = myAccountSrvc;
            this.$state = $state;
            this.showLoading = true;
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
            this.bookmarkChangeCB = function (showOrHide, movieId) {
                _this.activate();
            };
            myAccountSrvc.hasLoggedUser()
                .then(this.activate)
                .catch(function () {
                $state.go('home');
            });
        }
        BookMarkCtrl.$inject = ['bookmarkSrvc', 'homeservice', 'myAccountSrvc', '$state'];
        return BookMarkCtrl;
    }());
    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
})(angularApp || (angularApp = {}));

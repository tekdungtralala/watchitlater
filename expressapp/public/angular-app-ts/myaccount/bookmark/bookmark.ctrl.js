var angularApp;
(function (angularApp) {
    "use strict";
    var BookMarkCtrl = (function () {
        function BookMarkCtrl(homeService, myAccountSrvc, $state) {
            var _this = this;
            this.homeService = homeService;
            this.myAccountSrvc = myAccountSrvc;
            this.$state = $state;
            this.showLoading = true;
            this.movies = [];
            this.removedMovies = [];
            this.activate = function () {
                _this.showLoading = false;
                _this.myAccountSrvc.getBookmarkMovies().then(_this.afterGetMovies);
            };
            this.afterGetMovies = function (movies) {
                _this.movies = movies;
            };
            this.showMovieDetail = function (movieId) {
                _this.homeService.showMovieDetail(_this.movies, movieId, _this.bookmarkChangeCB);
            };
            this.bookmarkChangeCB = function (addOrRmv, movieId) {
                console.log('bookmarkChangeCB  ', addOrRmv, movieId);
                if (addOrRmv) {
                    var tmp = _.remove(_this.removedMovies, function (m) {
                        return m.imdbID === movieId;
                    })[0];
                    _this.movies.push(tmp);
                }
                else {
                    var tmp = _.remove(_this.movies, function (m) {
                        return m.imdbID === movieId;
                    })[0];
                    _this.removedMovies.push(tmp);
                }
            };
            myAccountSrvc.hasLoggedUser()
                .then(this.activate)
                .catch(function () {
                $state.go('home');
            });
        }
        BookMarkCtrl.$inject = ['homeservice', 'myAccountSrvc', '$state'];
        return BookMarkCtrl;
    }());
    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
})(angularApp || (angularApp = {}));

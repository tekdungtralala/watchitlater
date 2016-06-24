var angularApp;
(function (angularApp) {
    "use strict";
    var BookMarkCtrl = (function () {
        function BookMarkCtrl(homeService, myAccountSrvc, $state) {
            var _this = this;
            this.homeService = homeService;
            this.myAccountSrvc = myAccountSrvc;
            this.$state = $state;
            this.movies = [];
            this.activate = function () {
                _this.myAccountSrvc.getBookmarkMovies().then(_this.afterGetMovies);
            };
            this.afterGetMovies = function (movies) {
                _this.movies = movies;
            };
            this.showMovieDetail = function (movieId) {
                _this.homeService.showMovieDetail(_this.movies, movieId);
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

var angularApp;
(function (angularApp) {
    "use strict";
    var TopMovieCtrl = (function () {
        function TopMovieCtrl(homeService) {
            var _this = this;
            this.homeService = homeService;
            this.showLoading = true;
            this.listMovie = null;
            this.afterGetData = function (results) {
                _this.showLoading = false;
                _.orderBy(results, ['imdbRating'], ['desc']);
                _this.listMovie = results;
            };
            this.showMovieDetail = function (movieId) {
                _this.homeService
                    .showMovieDetail(_this.listMovie, movieId);
            };
            homeService
                .getLatestTopMovie(0, 300)
                .then(this.afterGetData);
        }
        TopMovieCtrl.$inject = ["homeservice"];
        return TopMovieCtrl;
    }());
    angular
        .module("app")
        .controller('TopMovieCtrl', TopMovieCtrl);
})(angularApp || (angularApp = {}));

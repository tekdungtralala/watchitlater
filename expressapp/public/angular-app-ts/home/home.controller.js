var angularApp;
(function (angularApp) {
    "use strict";
    var HomeCtrl = (function () {
        function HomeCtrl(homeService) {
            var _this = this;
            this.homeService = homeService;
            this.movieList = [];
            this.listBO = [];
            this.listTM = [];
            this.afterGetResult = function (result) {
                _this.afterGetLatestBO(result[0]);
                _this.afterGetLatestTM(result[1]);
            };
            this.afterGetLatestTM = function (result) {
                _this.listTM = result;
            };
            this.afterGetLatestBO = function (result) {
                _this.listBO[0] = _.slice(result, 0, 3);
                _this.addToMovieList(_this.listBO[0]);
                _this.listBO[1] = _.slice(result, 3, 6);
                _this.addToMovieList(_this.listBO[1]);
                _this.listBO[2] = _.slice(result, 6, 9);
                _this.addToMovieList(_this.listBO[2]);
            };
            this.addToMovieList = function (movies) {
                _.forEach(movies, function (m) {
                    _this.movieList.push(m);
                });
            };
            var arrayPromise;
            arrayPromise = [
                this.homeService.getLatestBoxOffice(),
                this.homeService.getLatestTopMovie(0, 5)
            ];
            this.homeService.ready(arrayPromise).then(this.afterGetResult);
        }
        HomeCtrl.$inject = ["homeservice"];
        return HomeCtrl;
    }());
    angular
        .module("app")
        .controller('HomeCtrl', HomeCtrl);
})(angularApp || (angularApp = {}));

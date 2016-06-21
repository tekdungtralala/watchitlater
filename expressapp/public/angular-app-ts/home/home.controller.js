var angularApp;
(function (angularApp) {
    "use strict";
    var HomeCtrl = (function () {
        function HomeCtrl(homeService, $document) {
            var _this = this;
            this.homeService = homeService;
            this.$document = $document;
            this.movieList = [];
            this.listBO = [];
            this.listTM = [];
            this.viewMovieDetail = function (movieId) {
                _this.homeService.showMovieDetail(_this.movieList, movieId);
            };
            this.afterGetResult = function (result) {
                _this.afterGetLatestBO(result[0]);
                _this.afterGetLatestTM(result[1]);
            };
            this.afterGetLatestTM = function (result) {
                _this.listTM = result;
                _this.addToMovieList(_this.listTM);
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
            this.scrollToElmt = function (elmtId) {
                _this.$document.duScrollToElementAnimated(angular.element(document.getElementById(elmtId)), 0, 700);
            };
            var arrayPromise;
            arrayPromise = [
                this.homeService.getLatestBoxOffice(),
                this.homeService.getLatestTopMovie(0, 5)
            ];
            this.homeService.ready(arrayPromise).then(this.afterGetResult);
        }
        HomeCtrl.$inject = ["homeservice", "$document"];
        return HomeCtrl;
    }());
    angular
        .module("app")
        .controller('HomeCtrl', HomeCtrl);
})(angularApp || (angularApp = {}));

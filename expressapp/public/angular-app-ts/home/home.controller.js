var angularApp;
(function (angularApp) {
    "use strict";
    var HomeCtrl = (function () {
        function HomeCtrl(homeService) {
            var _this = this;
            this.homeService = homeService;
            this.movieList = [];
            this.listBO = [];
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
                    this.movieList.push(m);
                });
            };
            this.homeService
                .getLatestBoxOffice()
                .then(this.afterGetLatestBO);
        }
        HomeCtrl.$inject = ["homeservice"];
        return HomeCtrl;
    }());
    angular
        .module("app")
        .controller('HomeCtrl', HomeCtrl);
})(angularApp || (angularApp = {}));

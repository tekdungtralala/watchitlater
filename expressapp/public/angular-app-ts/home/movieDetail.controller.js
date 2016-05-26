var angularApp;
(function (angularApp) {
    "use strict";
    var MovieDetailCtrl = (function () {
        function MovieDetailCtrl($uibModalInstance, movieList, movieId) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.movieList = movieList;
            this.movieId = movieId;
            this.findMovie = function (movieId) {
                var prev, next, index;
                _.forEach(_this.movieList, function (m, i) {
                    if (movieId === m.imdbID) {
                        _this.selectedMovie = m;
                        index = i;
                    }
                });
                prev = index - 1;
                next = index + 1;
                prev = (prev === -1) ? _this.movieList.length - 1 : prev;
                next = (next >= _this.movieList.length) ? 0 : next;
                _this.prevMovie = _this.movieList[prev];
                _this.nextMovie = _this.movieList[next];
            };
            this.findMovie(movieId);
        }
        return MovieDetailCtrl;
    }());
    angular
        .module("app")
        .controller('MovieDetailCtrl', MovieDetailCtrl);
})(angularApp || (angularApp = {}));

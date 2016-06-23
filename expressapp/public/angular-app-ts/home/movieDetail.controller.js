var angularApp;
(function (angularApp) {
    "use strict";
    var MovieDetailCtrl = (function () {
        function MovieDetailCtrl($uibModalInstance, myAccountSrvc, movieList, movieId) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.myAccountSrvc = myAccountSrvc;
            this.movieList = movieList;
            this.movieId = movieId;
            this.attachSNSHandler = function () {
                setTimeout(function () {
                    window.gapi.load('auth2', function () {
                        window.auth2.attachClickHandler(document.getElementById('google-signin-btn-movieDetail'));
                    });
                }, 1);
            };
            this.closeDialog = function () {
                _this.$uibModalInstance.dismiss('cancel');
            };
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
                _this.bookmarked = _.findIndex(_this.myAccountSrvc.getBookmarks(), function (m) {
                    return m === movieId;
                }) >= 0;
            };
            this.bookmarkSwitch = function () {
                if (_this.bookmarked)
                    _this.myAccountSrvc.addToBookmark(_this.selectedMovie.imdbID);
                else
                    _this.myAccountSrvc.removeFromBookmark(_this.selectedMovie.imdbID);
            };
            this.findMovie(movieId);
            this.attachSNSHandler();
        }
        return MovieDetailCtrl;
    }());
    angular
        .module("app")
        .controller('MovieDetailCtrl', MovieDetailCtrl);
})(angularApp || (angularApp = {}));

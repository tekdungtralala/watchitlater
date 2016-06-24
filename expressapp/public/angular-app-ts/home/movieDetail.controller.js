var angularApp;
(function (angularApp) {
    "use strict";
    var MovieDetailCtrl = (function () {
        function MovieDetailCtrl(bookmarkSrvc, $uibModalInstance, movieList, movieId, bookmarkChangeCB) {
            var _this = this;
            this.bookmarkSrvc = bookmarkSrvc;
            this.$uibModalInstance = $uibModalInstance;
            this.movieList = movieList;
            this.movieId = movieId;
            this.bookmarkChangeCB = bookmarkChangeCB;
            this.firestLoad = true;
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
                _this.bookmarked = _.findIndex(_this.bookmarkSrvc.getBookmarks(), function (m) {
                    return m === movieId;
                }) >= 0;
            };
            this.bookmarkSwitch = function () {
                if (_this.firestLoad) {
                    _this.firestLoad = false;
                    return;
                }
                if (_this.bookmarked) {
                    _this.bookmarkSrvc.addToBookmark(_this.selectedMovie.imdbID);
                    if (_this.bookmarkChangeCB)
                        _this.bookmarkChangeCB(true, _this.selectedMovie.imdbID);
                }
                else {
                    _this.bookmarkSrvc.removeFromBookmark(_this.selectedMovie.imdbID);
                    if (_this.bookmarkChangeCB)
                        _this.bookmarkChangeCB(false, _this.selectedMovie.imdbID);
                }
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

var angularApp;
(function (angularApp) {
    "use strict";
    var MovieDetailCtrl = (function () {
        function MovieDetailCtrl(bookmarkSrvc, $scope, $uibModalInstance, movieList, movieId, bookmarkChangeCB) {
            var _this = this;
            this.bookmarkSrvc = bookmarkSrvc;
            this.$scope = $scope;
            this.$uibModalInstance = $uibModalInstance;
            this.movieList = movieList;
            this.movieId = movieId;
            this.bookmarkChangeCB = bookmarkChangeCB;
            this.runWatchListener = function () {
                _this.$scope.$watch('vm.bookmarked', _this.bookmarkSwitch);
            };
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
                var tmp = _.findIndex(_this.bookmarkSrvc.getBookmarks(), function (m) {
                    return m === movieId;
                }) >= 0;
                _this.firestLoad = tmp !== _this.bookmarked;
                _this.bookmarked = tmp;
                _this.watched = _.findIndex(_this.bookmarkSrvc.getWatched(), function (m) {
                    return m === movieId;
                }) >= 0;
            };
            this.bookmarkSwitch = function (newBookmark) {
                if (_this.firestLoad) {
                    _this.firestLoad = false;
                    return;
                }
                if (_this.bookmarked) {
                    _this.bookmarkSrvc.addToBookmark(_this.selectedMovie.imdbID)
                        .then(_this.callCbIfAvailable);
                }
                else {
                    _this.bookmarkSrvc
                        .removeFromBookmark(_this.selectedMovie.imdbID)
                        .then(_this.callCbIfAvailable);
                }
            };
            this.moveToBookmark = function () {
                _this.bookmarkSrvc.addToBookmark(_this.selectedMovie.imdbID)
                    .then(_this.callCbIfAvailable)
                    .then(_this.updateCurrentMovie);
            };
            this.callCbIfAvailable = function () {
                if (_this.bookmarkChangeCB)
                    _this.bookmarkChangeCB();
            };
            this.updateCurrentMovie = function () {
                _this.findMovie(_this.selectedMovie.imdbID);
            };
            this.bookmarked = null;
            this.runWatchListener();
            this.findMovie(movieId);
            this.attachSNSHandler();
        }
        return MovieDetailCtrl;
    }());
    angular
        .module("app")
        .controller('MovieDetailCtrl', MovieDetailCtrl);
})(angularApp || (angularApp = {}));

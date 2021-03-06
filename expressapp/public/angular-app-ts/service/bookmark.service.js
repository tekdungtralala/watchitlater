var angularApp;
(function (angularApp) {
    var BookmarkSrvc = (function () {
        function BookmarkSrvc($http) {
            var _this = this;
            this.$http = $http;
            this.bookmarks = [];
            this.allWatched = [];
            this.getBookmarks = function () {
                return _this.bookmarks;
            };
            this.getBookmarkMovies = function () {
                return _this.$http.get('/api/bookmarks/movie').then(_this.getData);
            };
            this.getWatched = function () {
                return _this.allWatched;
            };
            this.getWatchedMovies = function () {
                return _this.$http.get('/api/watched/movie').then(_this.getData);
            };
            this.addToBookmark = function (imdbId) {
                var data = { imdbId: imdbId };
                return _this.$http.post('/api/bookmarks?' + _this.addRandomParam(), data)
                    .then(_this.updateBookmark)
                    .then(function () {
                    return true;
                });
            };
            this.removeFromBookmark = function (movieId) {
                return _this.$http.delete('/api/bookmarks?movieId=' + movieId + _this.addRandomParam())
                    .then(_this.updateBookmark)
                    .then(function () {
                    return true;
                });
            };
            this.addToWatched = function (imdbId) {
                var data = { imdbId: imdbId };
                return _this.$http.post('/api/watched?' + _this.addRandomParam(), data)
                    .then(_this.updateBookmark)
                    .then(function () {
                    return true;
                });
            };
            this.updateBookmark = function () {
                return _this.$http.get('/api/bookmarks?' + _this.addRandomParam())
                    .then(_this.getData)
                    .then(_this.processBookmarks)
                    .then(_this.updateWatched);
            };
            this.updateWatched = function () {
                return _this.$http.get('/api/watched?' + _this.addRandomParam()).then(_this.getData).then(_this.processWatched);
            };
            this.processBookmarks = function (results) {
                _this.bookmarks = results;
            };
            this.processWatched = function (results) {
                _this.allWatched = results;
                return true;
            };
            this.getData = function (result) {
                return result.data;
            };
            this.addRandomParam = function () {
                return '&randomInt=' + _this.getRandomInt(0, 10000);
            };
            this.getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
        }
        BookmarkSrvc.$inject = ['$http'];
        return BookmarkSrvc;
    }());
    angular
        .module("app")
        .service('bookmarkSrvc', BookmarkSrvc);
})(angularApp || (angularApp = {}));

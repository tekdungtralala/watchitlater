var angularApp;
(function (angularApp) {
    var Homeservice = (function () {
        function Homeservice($q, $http) {
            var _this = this;
            this.$q = $q;
            this.$http = $http;
            this.isPrimed = false;
            this.success = function () {
                _this.isPrimed = true;
            };
            this.prime = function () {
                if (_this.primePromise) {
                    return _this.primePromise;
                }
                _this.primePromise = _this.$q.when(true).then(_this.success);
                return _this.primePromise;
            };
        }
        Homeservice.prototype.getLatestBoxOffice = function () {
            var apiUrl = '/api/weeklymovie';
            return this.$http.get(apiUrl).then(this.getData);
        };
        Homeservice.prototype.getLatestTopMovie = function (skip, limit) {
            skip = skip ? skip : 0;
            limit = limit ? limit : 0;
            var apiUrl = '/api/getLatestTopMovie?skip=' + skip + '&limit=' + limit;
            return this.$http.get(apiUrl).then(this.getData);
        };
        Homeservice.prototype.ready = function (arrayPromise) {
            var _this = this;
            var readyPromise = this.primePromise || this.prime();
            return readyPromise
                .then(function () {
                return _this.$q.all(arrayPromise);
            });
        };
        Homeservice.prototype.getData = function (result) {
            return result.data;
        };
        Homeservice.$inject = ["$q", "$http"];
        return Homeservice;
    }());
    angular
        .module("app")
        .service('homeservice', Homeservice);
})(angularApp || (angularApp = {}));

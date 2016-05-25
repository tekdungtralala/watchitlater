var angularApp;
(function (angularApp) {
    var Homeservice = (function () {
        function Homeservice($http) {
            this.$http = $http;
        }
        Homeservice.prototype.getLatestBoxOffice = function () {
            var apiUrl = '/api/weeklymovie';
            return this.$http.get(apiUrl).then(this.getData);
        };
        Homeservice.prototype.getData = function (result) {
            return result.data;
        };
        Homeservice.$inject = ["$http"];
        return Homeservice;
    }());
    angular
        .module("app")
        .service('homeservice', Homeservice);
})(angularApp || (angularApp = {}));

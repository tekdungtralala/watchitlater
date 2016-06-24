var angularApp;
(function (angularApp) {
    var BoxOfficeSrvc = (function () {
        function BoxOfficeSrvc($http) {
            this.$http = $http;
        }
        BoxOfficeSrvc.prototype.postWeeklymovie = function (date) {
            return this.$http.post('/api/weeklymovie?date=' + date, {}).then(this.getData);
        };
        BoxOfficeSrvc.prototype.getWeeklymovie = function (date) {
            var apiUrl = '/api/weeklymovie?date=' + date;
            return this.$http.get(apiUrl).then(this.getData);
        };
        BoxOfficeSrvc.prototype.getData = function (result) {
            return result.data;
        };
        BoxOfficeSrvc.$inject = ["$http"];
        return BoxOfficeSrvc;
    }());
    angular
        .module("app")
        .service('boxOfficeSrvc', BoxOfficeSrvc);
})(angularApp || (angularApp = {}));

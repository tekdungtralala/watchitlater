var angularApp;
(function (angularApp) {
    "use strict";
    var MyAccountCtrl = (function () {
        function MyAccountCtrl($state, myAccountSrvc) {
            this.$state = $state;
            this.myAccountSrvc = myAccountSrvc;
            var stateName = $state.current.name;
            if ('my-account' === stateName) {
                $state.go('.bookmark');
            }
        }
        MyAccountCtrl.$inject = ["$state", "myAccountSrvc"];
        return MyAccountCtrl;
    }());
    angular
        .module('app')
        .controller('MyAccountCtrl', MyAccountCtrl);
})(angularApp || (angularApp = {}));

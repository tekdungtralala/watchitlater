var angularApp;
(function (angularApp) {
    "use strict";
    var MyAccountCtrl = (function () {
        function MyAccountCtrl($state) {
            this.$state = $state;
            if ('my-account' === $state.current.name)
                $state.go('.bookmark');
        }
        MyAccountCtrl.$inject = ["$state"];
        return MyAccountCtrl;
    }());
    angular
        .module('app')
        .controller('MyAccountCtrl', MyAccountCtrl);
})(angularApp || (angularApp = {}));

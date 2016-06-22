var angularApp;
(function (angularApp) {
    "use strict";
    var BookMarkCtrl = (function () {
        function BookMarkCtrl(myAccountSrvc, $state) {
            this.myAccountSrvc = myAccountSrvc;
            this.$state = $state;
            myAccountSrvc.hasLoggedUser()
                .catch(function () {
                $state.go('home');
            });
        }
        BookMarkCtrl.$inject = ['myAccountSrvc', '$state'];
        return BookMarkCtrl;
    }());
    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
})(angularApp || (angularApp = {}));

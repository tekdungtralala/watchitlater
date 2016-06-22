var angularApp;
(function (angularApp) {
    "use strict";
    var BookMarkCtrl = (function () {
        function BookMarkCtrl(myAccountService, $state) {
            this.myAccountService = myAccountService;
            this.$state = $state;
            myAccountService.hasLoggedUser()
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

/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
    "use strict";

    class BookMarkCtrl {
        static $inject = ['myAccountSrvc', '$state'];
        constructor(
            private myAccountService: IMyAccountSrvc, 
            private $state: angular.ui.IStateService) {

            myAccountService.hasLoggedUser()
                .catch(function() {
                    $state.go('home');
                })
        }
    }

    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
}
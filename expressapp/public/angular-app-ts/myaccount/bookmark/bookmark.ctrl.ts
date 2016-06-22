/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		static $inject = ['myAccountSrvc', '$state'];
		constructor(
			private myAccountSrvc: IMyAccountSrvc, 
			private $state: angular.ui.IStateService) {

			myAccountSrvc.hasLoggedUser()
				.catch(function() {
					$state.go('home');
				})
		}
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
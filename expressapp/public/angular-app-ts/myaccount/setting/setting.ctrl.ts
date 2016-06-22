/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class SettingCtrl {
		static $inject = ['$state', 'myAccountSrvc'];
		private loggedUser: LoggedUser;
		constructor(
			private $state: angular.ui.IStateService, 
			private myAccountSrvc: IMyAccountSrvc) {

			myAccountSrvc.hasLoggedUser()
				.then(this.activate)
				.catch(function() {
					$state.go('home');
				})
		}

		activate = (): void => {
			this.loggedUser = this.myAccountSrvc.getLoggedUser();
		}
	}

	angular
		.module('app')
		.controller('SettingCtrl', SettingCtrl);
}
/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";
	declare var window: AppWindow;

	class SettingCtrl {
		private showLoading: boolean = true;
		private loggedUser: LoggedUser;

		static $inject = ['$state', 'myAccountSrvc'];
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
			this.showLoading = false;
			this.loggedUser = this.myAccountSrvc.getLoggedUser();
		}

		signout = (): void => {
			let t = this;
			window.auth2.signOut().then(function() {
				t.$state.go('home');
			});
		}
	}

	angular
		.module('app')
		.controller('SettingCtrl', SettingCtrl);
}
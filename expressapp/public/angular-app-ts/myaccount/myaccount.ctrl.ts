/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class MyAccountCtrl {
		static $inject = ["$state", "myAccountSrvc"];
		constructor(
			private $state: angular.ui.IStateService,
			private myAccountSrvc: IMyAccountSrvc) {

			// redirect to bookmark state
			let stateName: string = $state.current.name; 		
			if ('my-account' === stateName) {
				$state.go('.bookmark');
			}
		}
	}

	angular
		.module('app')
		.controller('MyAccountCtrl', MyAccountCtrl);
}
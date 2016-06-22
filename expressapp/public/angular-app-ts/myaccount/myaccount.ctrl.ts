/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class MyAccountCtrl {
		static $inject = ["$state"];

		constructor(private $state: angular.ui.IStateService) {
			// redirect to bookmark state 
			if ('my-account' === $state.current.name)
				$state.go('.bookmark');
		}
	}

	angular
		.module('app')
		.controller('MyAccountCtrl', MyAccountCtrl);
}
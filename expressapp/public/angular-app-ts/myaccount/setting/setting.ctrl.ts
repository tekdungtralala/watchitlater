/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class SettingCtrl {
		constructor() {

			console.log('SettingCtrl')
		}
	}

	angular
		.module('app')
		.controller('SettingCtrl', SettingCtrl);
}
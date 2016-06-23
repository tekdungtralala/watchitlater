/// <reference path="../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	angular
		.module("app", [
		// Angular module
		'ngSanitize',
		// Third party module
		'ui.router',
		'ui.bootstrap',
		'duScroll',
		'oc.lazyLoad',
		'frapontillo.bootstrap-switch'
		// 'xeditable',
		// 'cgBusy',
	  ]);
}
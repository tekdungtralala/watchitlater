/// <reference path="../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	function routerConfig($stateProvider: angular.ui.IStateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/angular-app/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm',
            resolve: {
                loadCtrl: function ($ocLazyLoad: oc.ILazyLoad) {
                    return $ocLazyLoad.load(['homeservice', 'HomeCtrl'], {serie: true});
                }
            }
        });
	}

	angular.module('app').config(routerConfig);
}
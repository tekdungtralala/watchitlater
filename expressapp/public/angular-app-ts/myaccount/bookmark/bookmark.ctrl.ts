/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		private movies: Movie[] = [];

		static $inject = ['homeservice', 'myAccountSrvc', '$state'];
		constructor(
			private homeService: IHomeService,
			private myAccountSrvc: IMyAccountSrvc, 
			private $state: angular.ui.IStateService) {

			myAccountSrvc.hasLoggedUser()
				.then(this.activate)
				.catch(function() {
					$state.go('home');
				})
		}

		activate = (): void => {
			this.myAccountSrvc.getBookmarkMovies().then(this.afterGetMovies);
		}

		afterGetMovies = (movies: Movie[]): void => {
			this.movies = movies;
		}

		showMovieDetail = (movieId: string): void => {
			this.homeService.showMovieDetail(this.movies, movieId);
		}
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
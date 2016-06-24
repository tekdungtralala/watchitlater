/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		private showLoading: boolean = true;
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
			this.showLoading = false;
			this.myAccountSrvc.getBookmarkMovies().then(this.afterGetMovies);
		}

		afterGetMovies = (movies: Movie[]): void => {
			this.movies = _.clone(movies);
			_.forEach(this.movies, function(m: Movie) {
				m.showInBookmark = true;
			})
		}

		showMovieDetail = (movieId: string): void => {
			this.homeService.showMovieDetail(this.movies, movieId, this.bookmarkChangeCB);
		}

		bookmarkChangeCB = (showOrHide: boolean, movieId: string) : void => {
			this.activate();
		}
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
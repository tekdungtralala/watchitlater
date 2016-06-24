/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		private showLoading: boolean = true;
		private movies: Movie[] = [];
		private removedMovies: Movie[] = [];

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
			this.movies = movies;
		}

		showMovieDetail = (movieId: string): void => {
			this.homeService.showMovieDetail(this.movies, movieId, this.bookmarkChangeCB);
		}

		bookmarkChangeCB = (addOrRmv: boolean, movieId: string) : void => {
			console.log('bookmarkChangeCB  ',addOrRmv , movieId);
			if (addOrRmv) {
				let tmp: Movie = _.remove(this.removedMovies, function(m) {
					return m.imdbID === movieId;
				})[0];

				this.movies.push(tmp);
			} else {
				let tmp: Movie = _.remove(this.movies, function(m) {
					return m.imdbID === movieId;
				})[0];

				this.removedMovies.push(tmp);
			}
		}
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
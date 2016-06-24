/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	declare var window: AppWindow;
	
	class MovieDetailCtrl {
		public selectedMovie: Movie;
		public prevMovie: Movie;
		public nextMovie: Movie;
		public bookmarked: boolean;
		public watched: boolean;

		private firestLoad = true;
		
		constructor(
			private bookmarkSrvc: IBookmarkSrvc,
			private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance, 
			private movieList: Movie[], 
			private movieId: string,
			private bookmarkChangeCB: () => void) {
			
			this.findMovie(movieId);
			this.attachSNSHandler();
		}

		attachSNSHandler = () => {
			setTimeout(function() {
				window.gapi.load('auth2', function() {
					window.auth2.attachClickHandler(document.getElementById('google-signin-btn-movieDetail'));
				});
			}, 1);
		}
		
		closeDialog = (): void => {
			this.$uibModalInstance.dismiss('cancel');
		}
		
		findMovie = (movieId: string): void => {
			let prev: number, next: number, index: number;
			
			_.forEach(this.movieList, (m: Movie, i: number) => {
				if (movieId === m.imdbID) {
					this.selectedMovie = m;
					index = i;
				}
			});
			
			prev = index - 1;
			next = index + 1;

			prev = (prev === -1) ? this.movieList.length - 1 : prev;
			next = (next >= this.movieList.length) ? 0 : next;
			
			this.prevMovie = this.movieList[prev];
			this.nextMovie = this.movieList[next];

			this.bookmarked = _.findIndex(this.bookmarkSrvc.getBookmarks(), function (m: string) {
				return m === movieId;
			}) >= 0;

			this.watched = _.findIndex(this.bookmarkSrvc.getWatched(), function (m: string) {
				return m === movieId;
			}) >= 0;

			this.firestLoad = true;
		}

		bookmarkSwitch = (): void => {
			if (this.firestLoad) {
				this.firestLoad = false;
				return;
			}

			if (this.bookmarked) {
				this.bookmarkSrvc.addToBookmark(this.selectedMovie.imdbID)
					.then(this.callCbIfAvailable);
			} else {
				this.bookmarkSrvc
					.removeFromBookmark(this.selectedMovie.imdbID)
					.then(this.callCbIfAvailable);
			}
		}

		moveToBookmark = (): void => {
			this.bookmarkSrvc.addToBookmark(this.selectedMovie.imdbID)
				.then(this.callCbIfAvailable)
				.then(this.updateCurrentMovie);
		}

		callCbIfAvailable = (): void => {
			if (this.bookmarkChangeCB) this.bookmarkChangeCB();
		}

		updateCurrentMovie = (): void => {
			this.findMovie(this.selectedMovie.imdbID);
		}
	}
	
	angular
		.module("app")
		.controller('MovieDetailCtrl', MovieDetailCtrl);   
}
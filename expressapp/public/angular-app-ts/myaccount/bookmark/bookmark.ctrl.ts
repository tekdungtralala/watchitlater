/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		private showBookmarkLoading: boolean = true;
		private showWatchedLoading: boolean = true;
		private watchedOpened: boolean = false;
		private selectedMovie: Movie = null;
		private movies: Movie[] = [];
		private watchedMovies: Movie[] = [];
		private orderBookmarkBy: string = '-imdbRating';
		private orderWatchedBy: string = '-imdbRating';

		private modalInstance: angular.ui.bootstrap.IModalServiceInstance;

		static $inject = ['bookmarkSrvc', 'homeservice', 'myAccountSrvc', '$state', '$uibModal', '$scope'];
		constructor(
			private bookmarkSrvc: IBookmarkSrvc,
			private homeService: IHomeService,
			private myAccountSrvc: IMyAccountSrvc, 
			private $state: angular.ui.IStateService,
			private $uibModal: angular.ui.bootstrap.IModalService, 
			private $scope: ng.IScope) {

			myAccountSrvc.hasLoggedUser()
				.then(this.activate)
				.catch(function() {
					$state.go('home');
				})

			$scope.$watch('vm.watchedOpened', this.toggleWatchedElmt);
		}

		activate = (): void => {
			this.showBookmarkLoading = true;
			this.bookmarkSrvc.getBookmarkMovies().then(this.afterGetBookmarkMovies);

			if (this.watchedOpened) {
				this.updateWatchedMovies();
			}
		}

		toggleWatchedElmt = (newValue: boolean): void => {
			if (newValue) {
				this.updateWatchedMovies();
			}
		}

		updateWatchedMovies = (): void => {
			this.showWatchedLoading = true;
			this.bookmarkSrvc.getWatchedMovies().then(this.afterGetWatchedMovies);
		}

		afterGetBookmarkMovies = (movies: Movie[]): void => {
			this.showBookmarkLoading = false;
			this.movies = movies;
			this.addRealeasedTimestamp(this.movies);
		}

		addRealeasedTimestamp = (movies: Movie[]): void => {
			_.forEach(movies, function(m: Movie) {
				m.releasedTimestamp = Number(moment(m.Released, "DD MMM YYYY").format('X'));
			});
		}

		afterGetWatchedMovies = (movies: Movie[]): void => {
			this.showWatchedLoading = false;
			this.watchedMovies = movies;
			this.addRealeasedTimestamp(this.watchedMovies);
		}

		showMovieDetail = (movieId: string, listMovies: Movie[]): void => {
			this.homeService.showMovieDetail(listMovies, movieId, this.bookmarkChangeCB);
		}

		bookmarkChangeCB = () : void => {
			this.activate();
		}

		preAddTowatched = (movie: Movie): void => {
			this.selectedMovie = movie;

			let t = this;
			this.modalInstance = this.$uibModal.open({
				animation: true,
				templateUrl: 'watchedConfirm.html',
				scope: t.$scope,
				backdrop: 'static'
			});
		}

		doAddWatched = (): void => {
			this.showBookmarkLoading = true;
			this.showWatchedLoading = true;
			this.doCancel();
			this.bookmarkSrvc.addToWatched(this.selectedMovie.imdbID).then(this.activate);
		}

		preUnBookmark = (movie: Movie): void => {
			this.selectedMovie = movie;

			let t = this;
			this.modalInstance = this.$uibModal.open({
				animation: true,
				templateUrl: 'unbookmarkConfirm.html',
				scope: t.$scope,
				backdrop: 'static'
			});
		}

		doUnbookmark = (): void => {
			this.doCancel();
			this.showBookmarkLoading = true;
			this.bookmarkSrvc.removeFromBookmark(this.selectedMovie.imdbID).then(this.activate);
		}

		doCancel = (): void => {
			if (this.modalInstance && this.modalInstance.dismiss) this.modalInstance.dismiss();
		}

		moveToBookmark = (movieId: string): void => {
			this.showBookmarkLoading = true;
			this.showWatchedLoading = true;
			this.bookmarkSrvc.addToBookmark(movieId).then(this.activate);
		}

		sortBookmarkData = (newVal: string): void => {
			this.orderBookmarkBy = ('-' + newVal) === this.orderBookmarkBy ? ('+' + newVal) : ('-' + newVal); 
		}

		sortWatchedData = (newVal: string): void => {
			this.orderWatchedBy = ('-' + newVal) === this.orderWatchedBy ? ('+' + newVal) : ('-' + newVal); 
		}
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		private showBookmarkLoading: boolean = true;
		private showWatchedLoading: boolean = true;
		private watchedOpened: boolean = false;
		private selectedMovieId: string = null;
		private movies: Movie[] = [];
		private watchedMovies: Movie[] = [];

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
			this.showBookmarkLoading = false;
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
			this.movies = movies;
		}

		afterGetWatchedMovies = (movies: Movie[]): void => {
			this.showWatchedLoading = false;
			this.watchedMovies = movies;
		}

		showMovieDetail = (movieId: string, listMovies: Movie[]): void => {
			this.homeService.showMovieDetail(listMovies, movieId, this.bookmarkChangeCB);
		}

		bookmarkChangeCB = () : void => {
			this.activate();
		}

		preUnbookmark = (movieId: string): void => {
			this.selectedMovieId = movieId;

			let t = this;
			this.modalInstance = this.$uibModal.open({
				animation: true,
				templateUrl: 'watchedConfirm.html',
				size: 'sm',
				scope: t.$scope,
				backdrop: 'static'
			});
		}

		doWatched = (movieId: string): void => {
			this.doCancel();
			this.bookmarkSrvc.addToWatched(this.selectedMovieId).then(this.activate);
		}

		doCancel = (): void => {
			if (this.modalInstance && this.modalInstance.dismiss) this.modalInstance.dismiss();
		}

		moveToBookmark = (movieId: string): void => {
			this.bookmarkSrvc.addToBookmark(movieId).then(this.activate);
		}
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	class BookMarkCtrl {
		private showLoading: boolean = true;
		private selectedMovieId: string = null;
		private movies: Movie[] = [];
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
		}

		activate = (): void => {
			this.showLoading = false;
			this.bookmarkSrvc.getBookmarkMovies().then(this.afterGetMovies);
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
	}

	angular
		.module('app')
		.controller('BookMarkCtrl', BookMarkCtrl);
}
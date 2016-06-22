/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
	"use strict";

	declare var window: AppWindow;

	class HomeCtrl {
		protected movieList: Movie[] = [];
		public listBO: Array<Movie[]> = [];
		public listTM: Movie[] = [];

		static $inject = ["homeservice", "$document"];
		constructor(private homeService: IHomeService,
			private $document: duScroll.IDocumentService) {
			
			let arrayPromise: Array<ng.IPromise<any>>;
			arrayPromise = [
				this.homeService.getLatestBoxOffice(),
				this.homeService.getLatestTopMovie(0, 5)
			];
			
			this.homeService.ready(arrayPromise).then(this.afterGetResult);
			this.attachSNSHandler();
		}

		attachSNSHandler = () => {
			window.gapi.load('auth2', function() {
				window.auth2.attachClickHandler(document.getElementById('google-signin-btn-home'));
			});
		}
		
		viewMovieDetail = (movieId: string): void => {
			this.homeService.showMovieDetail(this.movieList, movieId);
		}
		
		afterGetResult = (result: Array<Movie[]>): void => {
			this.afterGetLatestBO(result[0]);
			this.afterGetLatestTM(result[1]);
		}
		
		afterGetLatestTM = (result: Movie[]): void => {
			this.listTM = result;
			this.addToMovieList(this.listTM);
		}
		
		afterGetLatestBO = (result: Movie[]) : void => {
			this.listBO[0] = _.slice(result, 0, 3);
			this.addToMovieList(this.listBO[0]);
			
			this.listBO[1] = _.slice(result, 3, 6);
			this.addToMovieList(this.listBO[1]);
			
			this.listBO[2] = _.slice(result, 6, 9);
			this.addToMovieList(this.listBO[2]);
		}
		
		addToMovieList = (movies: Movie[]): void => {
			_.forEach(movies, (m: Movie) => {
				this.movieList.push(m);
			})
		}
		
		scrollToElmt = (elmtId: string): void => {
			this.$document.duScrollToElementAnimated(angular.element(document.getElementById(elmtId)), 0, 700);
		}
	}

	angular
		.module("app")
		.controller('HomeCtrl', HomeCtrl);
}
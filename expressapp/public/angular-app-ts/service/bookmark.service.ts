/// <reference path="../app-reff.d.ts" />

module angularApp {

	declare let window: AppWindow;

	export interface IBookmarkSrvc {
		getBookmarks(): Array<String>
		getBookmarkMovies(): ng.IPromise<Movie[]>

		getWatched(): Array<String>

		addToBookmark(imdbId: string): ng.IPromise<boolean>
		removeFromBookmark(movieId: string): ng.IPromise<boolean>
		addToWatched(imdbId: string): ng.IPromise<boolean>

		updateBookmark(): void
	}

	class BookmarkSrvc implements IBookmarkSrvc {
		private bookmarks: Array<String> = [];
		private allWatched: Array<String> = [];

		static $inject = ['$http'];
		constructor(private $http: ng.IHttpService) {
		}

		getBookmarks = (): Array<String> => {
			return this.bookmarks;
		}

		getBookmarkMovies = (): ng.IPromise<Movie[]> => {
			return this.$http.get('/api/bookmarks/movie').then(this.getData);
		}

		addToBookmark = (imdbId: string): ng.IPromise<boolean> => {
			var data = {imdbId: imdbId};
			return this.$http.post('/api/bookmarks?' + this.addRandomParam(), data)
				.then(this.updateBookmark)
				.then(function() {
					return true;
				});
		}

		getWatched = (): Array<String> => {
			return this.allWatched;
		}

		removeFromBookmark = (movieId: string): ng.IPromise<boolean> => {
			return this.$http.delete('/api/bookmarks?movieId=' + movieId + this.addRandomParam())
				.then(this.updateBookmark)
				.then(function() {
					return true;
				});
		}

		addToWatched = (imdbId: string): ng.IPromise<boolean> => {
			var data = {imdbId: imdbId};
			return this.$http.post('/api/watched?' + this.addRandomParam(), data)
				.then(this.updateBookmark)
				.then(function() {
					return true;
				});
		}

		updateBookmark = (): ng.IPromise<boolean> => {
			return this.$http.get('/api/bookmarks?' + this.addRandomParam())
				.then(this.getData)
				.then(this.processBookmarks)
				.then(this.updateWatched);
		}

		updateWatched = (): ng.IPromise<boolean> => {
			return this.$http.get('/api/watched?' + this.addRandomParam()).then(this.getData).then(this.processWatched);
		}

		processBookmarks = (results: Array<string>): void => {
			this.bookmarks = results;
		}

		processWatched = (results: Array<string>): boolean => {
			this.allWatched = results;
			return true;
		}

getData = <T>(result: HttpResult<T>): T => {
	return result.data;
}

addRandomParam = (): string => {
	return '&randomInt=' + this.getRandomInt(0, 10000);
}

getRandomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
	}

	angular
		.module("app")
		.service('bookmarkSrvc', BookmarkSrvc);
}
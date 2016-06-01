/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
    "use strict";
 
    class TopMovieCtrl {
        private showLoading: boolean = true;
        private listMovie: Movie[] = null;

        static $inject = ["homeservice"];

        constructor(private homeService: IHomeService) {
            homeService
                .getLatestTopMovie(0, 300)
                .then(this.afterGetData);
        }
        
        afterGetData = (results: Movie[]): void => {
            this.showLoading = false;
            _.orderBy(results, ['imdbRating'], ['desc']);
            this.listMovie = results;
        }
        
        showMovieDetail = (movieId: string): void => {
            this.homeService
                .showMovieDetail(this.listMovie, movieId);
        }
    }
    
	angular
		.module("app")
        .controller('TopMovieCtrl', TopMovieCtrl);   
}
/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
    "use strict";   

    class HomeCtrl {
        protected movieList: Movie[] = [];
        public listBO: Array<Movie[]> = [];
        public listTM: Movie[] = [];

        static $inject = ["homeservice"];
        constructor(private homeService: IHomeService) {
            
            let arrayPromise: Array<ng.IPromise<any>>;
            arrayPromise = [
                this.homeService.getLatestBoxOffice(),
                this.homeService.getLatestTopMovie(0, 5)
            ];
            
            this.homeService.ready(arrayPromise).then(this.afterGetResult);
        }
        
        afterGetResult = (result: Array<Movie[]>): void => {
            this.afterGetLatestBO(result[0]);
            this.afterGetLatestTM(result[1]);
        }
        
        afterGetLatestTM = (result: Movie[]): void => {
            this.listTM = result;
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
    }

	angular
		.module("app")
        .controller('HomeCtrl', HomeCtrl);
}
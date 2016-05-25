/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
    "use strict";   

    class HomeCtrl {
        protected movieList: Movie[] = [];
        public listBO: Array<Movie[]> = [];

        static $inject = ["homeservice"];
        constructor(private homeService: IHomeService) {
            this.homeService
                .getLatestBoxOffice()
                .then(this.afterGetLatestBO);
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
            _.forEach(movies, function (m: Movie) {
                this.movieList.push(m);
            })
        }
    }

	angular
		.module("app")
        .controller('HomeCtrl', HomeCtrl);
}
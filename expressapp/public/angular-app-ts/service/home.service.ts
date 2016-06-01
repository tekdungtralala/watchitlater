/// <reference path="../app-reff.d.ts" />

module angularApp {  
    export interface IHomeService {
        showMovieDetail(movieList: Movie[], movieId: string): void
        getLatestBoxOffice(): ng.IPromise<Movie[]>
        getLatestTopMovie(skip: number, limit: number): ng.IPromise<Movie[]>
        ready(arrayPromise: Array<ng.IPromise<any>>): ng.IPromise<any>
    }

    class Homeservice implements IHomeService {
        private isPrimed: boolean = false;
        private primePromise: ng.IPromise<any>;
        
        static $inject = ["$q", "$http", "$uibModal", "$ocLazyLoad"];
		constructor(
            private $q: ng.IQService, 
            private $http: ng.IHttpService, 
            private $uibModal: angular.ui.bootstrap.IModalService,
            private $ocLazyLoad: oc.ILazyLoad) {
		}
        
        showMovieDetail(movieList: Movie[], movieId: string): void {
            this.$uibModal.open({
				templateUrl: 'angular-app/home/movieDetail.html',
				controller: 'MovieDetailCtrl',
				controllerAs: 'vm',
				size: 'lg',
				backdrop: 'static',
                resolve: {
					movieList: getMovieList,
					loadMovieDetailCtrl: this.loadMovieDetailCtrl,
					movieId: function() {
						return movieId;
					}
                }
            })
            .rendered.then(() => {
                
            });
            
            function getMovieList(): Movie[] {
                return movieList;
            }
        }
        
        loadMovieDetailCtrl = () : ng.IPromise<any> => {
            return this.$ocLazyLoad.load('MovieDetailCtrl');
        }
        
        getLatestBoxOffice(): ng.IPromise<Movie[]>{
            let apiUrl: string = '/api/weeklymovie';
            return this.$http.get(apiUrl).then(this.getData);
        }
        
        getLatestTopMovie(skip: number, limit: number): ng.IPromise<Movie[]> {
            skip = skip ? skip : 0;
            limit = limit ? limit : 0;
            let apiUrl: string = '/api/getLatestTopMovie?skip=' + skip + '&limit=' + limit;
            return this.$http.get(apiUrl).then(this.getData);
        }
        
        ready(arrayPromise: Array<ng.IPromise<any>>): ng.IPromise<Array<any>> {
            let readyPromise: ng.IPromise<any> = this.primePromise || this.prime();
            
            return readyPromise
                .then(() => {
                    return this.$q.all(arrayPromise);
                })
        }
        
        success = (): void => {
            this.isPrimed = true; 
        }
        
        prime = (): ng.IPromise<any> => {
            if (this.primePromise) {
                return this.primePromise;
            }
            
            this.primePromise = this.$q.when(true).then(this.success);
            return this.primePromise;
        }
        
        getData<T>(result: HttpResult<T>): T {
            return result.data;
        }
        
    }
    
    angular
        .module("app")
        .service('homeservice', Homeservice);
}

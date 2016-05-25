/// <reference path="../app-reff.d.ts" />

module angularApp {  
    export interface IHomeService {
        getLatestBoxOffice(): ng.IPromise<Movie[]>;
    }

    class Homeservice implements IHomeService{
        static $inject = ["$http"];
		constructor(private $http : ng.IHttpService) {	
		}
        
        getLatestBoxOffice(): ng.IPromise<Movie[]>{
            let apiUrl: string = '/api/weeklymovie';
            return this.$http.get(apiUrl).then(this.getData);
        }
        
        getData<T>(result: HttpResult<T>): T {
            return result.data;
        }
        
    }
    
    angular
        .module("app")
        .service('homeservice', Homeservice);
}

/// <reference path="../app-reff.d.ts" />

module angularApp {
	
	export interface IBoxOfficeSrvc {
		postWeeklymovie(date: string): ng.IPromise<Movie[]>
		getWeeklymovie(date: string): ng.IPromise<Movie[]>
	}
	
	class BoxOfficeSrvc implements IBoxOfficeSrvc {
		static $inject = ["$http"];
		
		constructor(private $http: ng.IHttpService) {
		}
		
		postWeeklymovie(date: string): ng.IPromise<Movie[]>{
			return this.$http.post('/api/weeklymovie?date=' + date, {}).then(this.getData);
		}
		
		getWeeklymovie(date: string): ng.IPromise<Movie[]> {
			let apiUrl: string = '/api/weeklymovie?date=' + date;
			return this.$http.get(apiUrl).then(this.getData);
		}
		
		getData<T>(result: HttpResult<T>): T {
			return result.data;
		}
	}
	
	angular
		.module("app")
		.service('boxOfficeSrvc', BoxOfficeSrvc);
}
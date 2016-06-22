/// <reference path="../app-reff.d.ts" />

module angularApp {
	declare var window: AppWindow;

	export interface IMyAccountSrvc {
		runListener(): void
		hasLoggedUser(): ng.IPromise<LoggedUser>
		getLoggedUser(): LoggedUser
		addToBookmark(imdbId: string): ng.IPromise<boolean>
	}

	class MyAccountSrvc implements IMyAccountSrvc {
		private gglUsrDefer: ng.IDeferred<boolean> = null;
		private gglUsrState: AppUserState = AppUserState.FINDING;

		static $inject = ['$rootScope', '$http', '$q'];
		constructor(
			private $rootScope: AppRootScope, 
			private $http: ng.IHttpService,
			private $q: ng.IQService) {
		}

		runListener(): void {
			let http: ng.IHttpService = this.$http;
			let rootScope: AppRootScope = this.$rootScope;

			this.gglUsrState = AppUserState.FINDING;
			this.gglUsrDefer = this.$q.defer();

			let _this = this;
			window.auth2.currentUser.listen(function(googleUser: any) {
				let isLogged: boolean = googleUser.isSignedIn();
				if (isLogged) {
					_this.gglUsrDefer.resolve(true);
					_this.gglUsrState = AppUserState.LOGGED;
				} else {
					_this.gglUsrDefer.reject(false);
					_this.gglUsrState = AppUserState.NOTLOGGED;
				}
			})

			window.auth2.isSignedIn.listen(function(isSigin: boolean) {
				function postUserSignIn(data: AppUser) {
					var req = {
						method: 'POST',
						url: '/api/signin',
						headers: {
							'Content-Type': 'application/json'
						},
						data: data
					};

					return http(req);
				}
				
				if (isSigin) {
					var profile = window.auth2.currentUser.get().getBasicProfile();
					let data: AppUser = {
						email: profile.getEmail(),
						socialNetwok: {
							fullName: profile.getName(),
							id: profile.getId(),
							imageUrl: profile.getImageUrl(),
							type: 'GOOGLE'
						}
					};

					postUserSignIn(data);

					rootScope.$apply(function() {
						rootScope.loggedUser =  new LoggedUser(data.socialNetwok.fullName, data.email);
						_this.gglUsrState = AppUserState.LOGGED;
					});
				} else {
					rootScope.$apply(function() {
						rootScope.loggedUser = null;
					});
				}

				// window.auth2.signOut().then(function() {
				//     console.log('User signed out.');
				// });
			});
		}

		getDeferObj(): ng.IDeferred<boolean> {
			return this.gglUsrDefer;
		}

		isFinishedGetUser(): boolean {
			return this.gglUsrState !== AppUserState.FINDING;
		}

		getLoggedUser(): LoggedUser {
			return this.$rootScope.loggedUser;
		}

		hasLoggedUser(): ng.IPromise<LoggedUser> {
			let result: ng.IDeferred<LoggedUser> = this.$q.defer();
			if (this.isFinishedGetUser()) {
				result.resolve(this.getLoggedUser());
			} else {
				let _this = this;
				this.getDeferObj().promise
					.then(function() {
						result.resolve(_this.getLoggedUser());
					})
					.catch(function() {
						result.reject();
					});
			}
			return result.promise;
		}

		addToBookmark(imdbId: string): ng.IPromise<boolean> {
			var req = {
				method: 'POST',
				url: '/api/addToBookmark',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					imdbId: imdbId
				}
			};
			return this.$http(req);
		}
	}

	angular
		.module("app")
		.service('myAccountSrvc', MyAccountSrvc);
}
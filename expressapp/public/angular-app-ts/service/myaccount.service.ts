/// <reference path="../app-reff.d.ts" />

module angularApp {
	declare var window: AppWindow;

	export interface IMyAccountSrvc {
		runListener(): void
		hasLoggedUser(): ng.IPromise<z>
		getLoggedUser(): LoggedUser
		addToBookmark(imdbId: string): ng.IPromise<boolean>
	}

	class MyAccountSrvc implements IMyAccountSrvc {
		private gglUsrDefer: ng.IDeferred<boolean> = null;
		private gglUsrState: AppUserState = AppUserState.FINDING;

		private bookmarks: Array<String> = [];

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

			let t = this;
			window.auth2.currentUser.listen(function(googleUser: any) {
				let isLogged: boolean = googleUser.isSignedIn();
				if (isLogged) {
					t.gglUsrDefer.resolve(true);
					t.gglUsrState = AppUserState.LOGGED;
				} else {
					t.gglUsrDefer.reject(false);
					t.gglUsrState = AppUserState.NOTLOGGED;
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

					return http(req).then(t.updateBookmark);
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
						t.gglUsrState = AppUserState.LOGGED;
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
				let t = this;
				this.getDeferObj().promise
					.then(function() {
						result.resolve(t.getLoggedUser());
					})
					.catch(function() {
						result.reject();
					});
			}
			return result.promise;
		}

		addToBookmark = (imdbId: string): ng.IPromise<boolean> => {
			var req = {
				method: 'POST',
				url: '/api/bookmarks',
				data: {
					imdbId: imdbId
				}
			};
			return this.$http(req)
				.then(this.updateBookmark)
				.then(function() {
					return true;
				});
		}

		updateBookmark = (): void => {
			this.$http.get('/api/bookmarks').then(this.getData).then(this.processData);
		}

		processData(results: Array<string>): void {
			this.bookmarks = results;
		}

		getData<T>(result: HttpResult<T>): T {
			return result.data;
		}
	}

	angular
		.module("app")
		.service('myAccountSrvc', MyAccountSrvc);
}
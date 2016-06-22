var angularApp;
(function (angularApp) {
    var MyAccountSrvc = (function () {
        function MyAccountSrvc($rootScope, $http, $q) {
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$q = $q;
            this.gglUsrDefer = null;
            this.gglUsrState = angularApp.AppUserState.FINDING;
        }
        MyAccountSrvc.prototype.runListener = function () {
            var http = this.$http;
            var rootScope = this.$rootScope;
            this.gglUsrState = angularApp.AppUserState.FINDING;
            this.gglUsrDefer = this.$q.defer();
            var _this = this;
            window.auth2.currentUser.listen(function (googleUser) {
                var isLogged = googleUser.isSignedIn();
                if (isLogged) {
                    _this.gglUsrDefer.resolve(true);
                    _this.gglUsrState = angularApp.AppUserState.LOGGED;
                }
                else {
                    _this.gglUsrDefer.reject(false);
                    _this.gglUsrState = angularApp.AppUserState.NOTLOGGED;
                }
            });
            window.auth2.isSignedIn.listen(function (isSigin) {
                function postUserSignIn(data) {
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
                    var data_1 = {
                        email: profile.getEmail(),
                        socialNetwok: {
                            fullName: profile.getName(),
                            id: profile.getId(),
                            imageUrl: profile.getImageUrl(),
                            type: 'GOOGLE'
                        }
                    };
                    postUserSignIn(data_1);
                    rootScope.$apply(function () {
                        rootScope.loggedUser = new angularApp.LoggedUser(data_1.socialNetwok.fullName, data_1.email);
                        _this.gglUsrState = angularApp.AppUserState.LOGGED;
                    });
                }
                else {
                    rootScope.$apply(function () {
                        rootScope.loggedUser = null;
                    });
                }
            });
        };
        MyAccountSrvc.prototype.getDeferObj = function () {
            return this.gglUsrDefer;
        };
        MyAccountSrvc.prototype.isFinishedGetUser = function () {
            return this.gglUsrState !== angularApp.AppUserState.FINDING;
        };
        MyAccountSrvc.prototype.getLoggedUser = function () {
            return this.$rootScope.loggedUser;
        };
        MyAccountSrvc.prototype.hasLoggedUser = function () {
            var result = this.$q.defer();
            if (this.isFinishedGetUser()) {
                result.resolve(this.getLoggedUser());
            }
            else {
                var _this_1 = this;
                this.getDeferObj().promise
                    .then(function () {
                    result.resolve(_this_1.getLoggedUser());
                })
                    .catch(function () {
                    result.reject();
                });
            }
            return result.promise;
        };
        MyAccountSrvc.$inject = ['$rootScope', '$http', '$q'];
        return MyAccountSrvc;
    }());
    angular
        .module("app")
        .service('myAccountSrvc', MyAccountSrvc);
})(angularApp || (angularApp = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var angularApp;
(function (angularApp) {
    var AppWindow = (function (_super) {
        __extends(AppWindow, _super);
        function AppWindow() {
            _super.apply(this, arguments);
        }
        return AppWindow;
    }(Window));
    angularApp.AppWindow = AppWindow;
    (function (AppUserState) {
        AppUserState[AppUserState["FINDING"] = 0] = "FINDING";
        AppUserState[AppUserState["LOGGED"] = 1] = "LOGGED";
        AppUserState[AppUserState["NOTLOGGED"] = 2] = "NOTLOGGED";
    })(angularApp.AppUserState || (angularApp.AppUserState = {}));
    var AppUserState = angularApp.AppUserState;
    var LoggedUser = (function () {
        function LoggedUser(fullName, email) {
            this.fullName = fullName;
            this.email = email;
        }
        LoggedUser.prototype.hasLoggedUser = function () {
            return this.fullName !== undefined && this.fullName !== null
                && this.email != undefined && this.email != null;
        };
        return LoggedUser;
    }());
    angularApp.LoggedUser = LoggedUser;
    var SocialNetwokType = (function () {
        function SocialNetwokType() {
        }
        return SocialNetwokType;
    }());
    angularApp.SocialNetwokType = SocialNetwokType;
    var AppUser = (function () {
        function AppUser() {
        }
        return AppUser;
    }());
    angularApp.AppUser = AppUser;
    var Movie = (function () {
        function Movie() {
        }
        return Movie;
    }());
    angularApp.Movie = Movie;
    var HttpResult = (function () {
        function HttpResult() {
        }
        return HttpResult;
    }());
    angularApp.HttpResult = HttpResult;
})(angularApp || (angularApp = {}));

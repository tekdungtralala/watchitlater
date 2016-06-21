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

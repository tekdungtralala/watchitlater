var angularApp;
(function (angularApp) {
    "use strict";
    angular
        .module("app", [
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'duScroll',
        'oc.lazyLoad',
        'frapontillo.bootstrap-switch'
    ]);
})(angularApp || (angularApp = {}));

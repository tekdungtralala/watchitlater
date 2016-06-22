var angularApp;
(function (angularApp) {
    "use strict";
    var SettingCtrl = (function () {
        function SettingCtrl() {
            console.log('SettingCtrl');
        }
        return SettingCtrl;
    }());
    angular
        .module('app')
        .controller('SettingCtrl', SettingCtrl);
})(angularApp || (angularApp = {}));

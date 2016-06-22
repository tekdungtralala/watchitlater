/// <reference path="../../../../../typings/tsd.d.ts" />

module angularApp {
    "use strict";

    class BookMarkCtrl {
        constructor() {

            console.log('BookMarkCtrl')
        }
    }

    angular
        .module('app')
        .controller('BookMarkCtrl', BookMarkCtrl);
}
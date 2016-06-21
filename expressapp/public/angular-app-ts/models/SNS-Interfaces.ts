/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
    export interface GoogleAuth {
        init(opt1: any): GoogleAuth
        attachClickHandler(opt1: any): void
        attachClickHandler(opt1: any, opt2: any, opt3: any, opt4: any): void
        currentUser: any
        isSignedIn: any
        signOut(): ng.IPromise<any>
    }
    export interface GoogleAPI {
        load(opt1: string, opt2: any): void
        auth2: GoogleAuth
    }
}
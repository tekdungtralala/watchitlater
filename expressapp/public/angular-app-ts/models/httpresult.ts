/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
    export class HttpResult<T> {
        data: T
        status: number
    }
}
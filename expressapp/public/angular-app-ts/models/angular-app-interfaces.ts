/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
    export class AppWindow extends Window {
        gapi: GoogleAPI
        auth2: GoogleAuth
    }

    export class Movie {
        Actors: string
        Awards: string
        Country: string
        Director: string
        Genre: string
        Language: string
        Metascore: string
        Plot: string
        Poster: string
        PosterImdb: string
        Released: string
        Runtime: string
        Title: string
        Type: string
        Writer: string
        Year: string
        created: string
        imdbID: string
        imdbRating: number
        isImageReady: boolean
    }

    export class HttpResult<T> {
        data: T
        status: number
    }
}
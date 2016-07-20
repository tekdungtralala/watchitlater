/// <reference path="../../../../typings/tsd.d.ts" />

module angularApp {
	export class AppWindow extends Window {
		gapi: GoogleAPI
		auth2: GoogleAuth
	}

	export enum AppUserState {
		FINDING, LOGGED, NOTLOGGED
	}

	export class LoggedUser {
		public fullName: string;
		public email: string;

		constructor(fullName?: string, email?: string) {
			this.fullName = fullName;
			this.email = email;
		}

		hasLoggedUser() : boolean {
			return this.fullName !== undefined && this.fullName !== null 
				&& this.email != undefined && this.email != null;
		}
	}

	export interface AppRootScope extends angular.IRootScopeService {
		showNavbar: boolean
		loggedUser: LoggedUser
		state: angular.ui.IStateService
	}

	export class SocialNetwokType {
		fullName: string
		id: string
		imageUrl: string
		type: string
	}

	export class AppUser {
		email: string
		socialNetwok: SocialNetwokType
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

		showInBookmark: boolean = true
		releasedTimestamp: number
	}

	export class HttpResult<T> {
		data: T
		status: number
	}
}
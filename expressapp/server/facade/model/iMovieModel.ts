/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');

interface iMovie {
	created: Date,
	isImageReady: Boolean,
	Title: string,
	Year: string,
	Released: string,
	Runtime: string,
	Genre: string,
	Director: string,
	Writer: string,
	Actors: string,
	Plot: string,
	Language: string,
	Country: string,
	Awards: string,
	Poster: string,
	PosterImdb: string,
	Metascore: string,
	imdbRating: number,
	imdbID: string,
	Type: string
}

interface iMovieModel extends iMovie, mongoose.Document {
}

export = iMovieModel
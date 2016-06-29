/// <reference path="../../../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import iMovieModel = require('../model/iMovieModel')

let MovieSchema: mongoose.Schema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Array
	},
	isImageReady: {
		type: Boolean
	},
	Title: {
		type: String,
		trim: true
	},
	Year: {
		type: String,
		trim: true
	},
	Released: {
		type: String,
		trim: true
	},
	Runtime: {
		type: String,
		trim: true
	},
	Genre: {
		type: String,
		trim: true
	},
	Director: {
		type: String,
		trim: true
	},
	Writer: {
		type: String,
		trim: true
	},
	Actors: {
		type: String,
		trim: true
	},
	Plot: {
		type: String,
		trim: true
	},
	Language: {
		type: String,
		trim: true
	},
	Country: {
		type: String,
		trim: true
	},
	Awards: {
		type: String,
		trim: true
	},
	Poster: {
		type: String,
		trim: true
	},
	PosterImdb: {
		type: String,
		trim: true
	},
	Metascore: {
		type: String,
		trim: true
	},
	imdbRating: {
		type: Number,
		trim: true
	},
	imdbID: {
		type: String,
		trim: true
	},
	Type: {
		type: String,
		trim: true
	}
});

let Movie: mongoose.Model<iMovieModel> = mongoose.model<iMovieModel>('Movie', MovieSchema);

export = Movie
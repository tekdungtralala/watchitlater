/// <reference path="../../../typings/tsd.d.ts" />

import Q = require('q');
import _ = require('lodash');
import request = require('request');
import fs = require('fs');

import movie = require('../facade/movie');
import appUtil = require('../util/appUtil');

import iMovieModel = require('../facade/model/iMovieModel');

let debug: debug.IDebug = require('debug')('watchitlater:server:movieUtil');

let movieUtilModule = {
	checkMovies: checkMovies
}

export = movieUtilModule

function checkMovies(): Q.Promise<boolean> {
	debug('checkMovies()');
	var deferred = Q.defer<boolean>();
	var movies: Array<iMovieModel> = [];
	var index = 0;

	function successSavedImage() {
		debug('  successSavedImage()');
		var currMovie = movies[index - 1];
		currMovie.isImageReady = true;
		currMovie.Poster = generateRelativePath(currMovie.imdbID);

		movie
			.createOrUpdate(currMovie)
			.then(processFetchImage);
	}

	function generateRealPath(imdbID: string) {
		return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
	}

	function generateRelativePath(imdbID: string) {
		return 'static-assets/imdb-img/' + imdbID + '.jpg';
	}

	function saveImage(url: string, imdbID: string) {
		var d = Q.defer();
		var imagePath = generateRealPath(imdbID);
		debug(imagePath);

		fs.access(imagePath, fs.F_OK, function(err) {
			if (!err) {
				debug('image exist, cancel download');
				d.resolve();
			} else {
				debug('start download');
				request.get({url: url, encoding: 'binary'}, function(err, response, body) {
					fs.writeFile(imagePath, body, 'binary', function(err) {
						if (err)
							d.reject(false);
						else
							d.resolve();
					});
				});
			}
		});

		return d.promise;
	}

	function processFetchImage() {
		if (index >= movies.length) {
			debug('finish checkMovies()');
			deferred.resolve();
		}

		var movie = movies[index];
		debug('processFetchImage ' + movie.imdbID);
		debug(movie.PosterImdb);
		index++;

		if (movie.isImageReady === false)
			saveImage(movie.PosterImdb, movie.imdbID)
				.then(successSavedImage)
				.fail(processFetchImage);
		else
			processFetchImage();
	}

	function afterFindMovies(result: Array<iMovieModel>) {
		movies = result;
		debug('movies.length = ' + movies.length);
	}

	function findMovies() {
		debug('findMovies()');
		movie
			.findMoviesWOImage()
			.then(afterFindMovies)
			.then(processFetchImage);
	}

	function afterCountMovie(result: number) {
		debug('afterCountMovie() result=' + result);
		if (result === 0)
			deferred.resolve(true);
		else
			findMovies();
	}

	movie
		.isHasMovieWOImage()
		.then(afterCountMovie);

	return deferred.promise;
}

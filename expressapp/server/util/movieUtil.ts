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
	checkThumbnailMovies: checkThumbnailMovies
}
export = movieUtilModule

function checkThumbnailMovies(): Q.Promise<boolean> {
	debug('checkThumbnailMovies()');
	var deferred = Q.defer<boolean>();
	var movies: Array<iMovieModel> = [];
	var index = 0;


	findAllMovieWithoutImageFile();

	function findAllMovieWithoutImageFile() {
		debug('findAllMovieWithoutImageFile()');
		movie.findAllMovie().then(afterFIndAllMovie);

		function afterFIndAllMovie(movies: iMovieModel[]) {
			let moviesWithoutRealImg: string[] = [];
			_.forEach(movies, function(m: iMovieModel) {
				try {
					fs.accessSync(generateRealPath(m.imdbID), fs.F_OK);
				} catch (err) {
					moviesWithoutRealImg.push(m.imdbID);
				}
			})

			debug('toal movies without image file : ' + moviesWithoutRealImg.length);
			findFailedSavedImage(moviesWithoutRealImg);
		}
	}

	function findFailedSavedImage(moviesWithoutRealImg: string[]) {
		var imgDir = 'expressapp/public/static-assets/imdb-img/';
		fs.readdir(imgDir, function(err: any, filesName: string[]) {
			_.forEach(filesName, function(f) {
				let fileSize: number = getFilesizeInBytes(imgDir + f);
				if (fileSize < 100) {
					moviesWithoutRealImg.push(f.split('.jpg')[0]);
				}
			})

			debug('toal movies with failed image : ' + moviesWithoutRealImg.length);
			movie.findByImdbIDs(moviesWithoutRealImg).then(afterFindSelectedMovie);
		});
	}

	function afterFindSelectedMovie(movies: iMovieModel[]) {
		debug('afterFindSelectedMovie movies.length = ' + movies.length);

		let currentIndex: number = 0;
		iterateMovie();

		function iterateMovie() {
			debug('iterateMovie() currentIndex = ' + currentIndex + ', total movie = ' + movies.length);
			if (currentIndex >= movies.length) {
				movie
					.isHasMovieWOImage()
					.then(afterCountMovie);
			} else {
				let m: iMovieModel = movies[currentIndex];

				let url: string = 'http://www.omdbapi.com/?i=' + m.imdbID + '&plot=full&r=json';
				debug('omdbapi url = ' + url);
				appUtil.fetchHtml(url)
					.then(processMovieData)
					.then(updateMovie) 
			}
		}

		function processMovieData(data: string): iMovieModel {
			debug('processMovieData()');
			return JSON.parse(data);

		}

		function updateMovie(m: iMovieModel) {
			debug('updateMovie() m.imdbId=' + m.imdbID + ', m.Poster=' + m.Poster);
			m.isImageReady = false;
			m.PosterImdb = m.Poster;
			movie.updateMovie(m.imdbID, m).then(afterUpdatedMovie).catch(afterUpdatedMovie);
		}

		function afterUpdatedMovie() {
			debug('afterUpdatedMovie()');
			currentIndex++;
			iterateMovie();
		}
	}
	

	function afterCountMovie(result: number) {
		debug('afterCountMovie() result=' + result);
		if (result === 0)
			deferred.resolve(true);
		else
			findMoviesWOImage();
	}

	function findMoviesWOImage() {
		debug('findMovies()');
		movie
			.findMoviesWOImage()
			.then(afterFindMovies)
			.then(processFetchImage);
	}

	function afterFindMovies(result: Array<iMovieModel>) {
		movies = result;
		debug('movies.length = ' + movies.length);
	}

	function processFetchImage() {
		if (index >= movies.length) {
			debug('finish checkThumbnailMovies()');
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

	function getFilesizeInBytes(filename: string): number {
		var stats = fs.statSync(filename)
		var fileSizeInBytes = stats["size"]
		return fileSizeInBytes;
	}

	return deferred.promise;
}

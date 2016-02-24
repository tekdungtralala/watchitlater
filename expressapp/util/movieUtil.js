var debug = require('debug')('watchitlater:server');
var Q = require('q');
var _ = require('lodash');
var request = require('request');
var fs = require('fs');

var movie = require('../entity/movie');
var appUtil = require('../util/appUtil');

var movieModule = {
	checkMovies: checkMovies
};

function checkMovies() {
	debug('movieUtil checkMovies()');
	var deferred = Q.defer();
	var movies = [];
	var index = 0;

	movie
		.isHasMovieWOImage()
		.then(afterCountMovie);

	function successSavedImage() {
		debug('  successSavedImage()');
		var currMovie = movies[index - 1];
		currMovie.isImageReady = true;
		currMovie.Poster = generateRelativePath(currMovie.imdbID);

		movie
			.createOrUpdate(currMovie)
			.then(processFetchImage);
	}

	function generateRealPath(imdbID) {
		return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
	}

	function generateRelativePath(imdbID) {
		return 'static-assets/imdb-img/' + imdbID + '.jpg';
	}

	function saveImage(url, imdbID) {
		var d = Q.defer();
		var imagePath = generateRealPath(imdbID);
		debug('  ' + imagePath);

		fs.access(imagePath, fs.F_OK, function(err) {
			if (!err) {
				debug('  image exist, cancel download');
				d.resolve();
			} else {
				debug('  start download');
				request.get({url: url, encoding: 'binary'}, function(err, response, body) {
					fs.writeFile(imagePath, body, 'binary', function(err) {
						if (err)
							d.reject();
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
			debug('  finish checkMovies()');
			deferred.resolve();
		}

		var movie = movies[index];
		debug('  processFetchImage ' + movie.imdbID);
		debug('  ' + movie.PosterImdb);
		index++;

		if (movie.isImageReady === false)
			saveImage(movie.PosterImdb, movie.imdbID)
				.then(successSavedImage)
				.fail(processFetchImage);
		else
			processFetchImage();
	}

	function afterFindMovies(result) {
		movies = result;
		debug('  movies.length = ' + movies.length);
	}

	function findMovies() {
		debug('  findMovies()');
		movie
			.findMoviesWOImage()
			.then(afterFindMovies)
			.then(processFetchImage);
	}

	function afterCountMovie(result) {
		debug('  result=' + result);

		if (result === 0)
			deferred.resolve();
		else
			findMovies();
	}

	return deferred.promise;
}

module.exports = movieModule;

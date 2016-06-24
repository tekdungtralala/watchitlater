var debug = require('debug')('watchitlater:server');
var bookmark = require('../entity/bookmark');
var movie = require('../entity/movie');
var _ = require('lodash');

var moduleexports = {
	getAllBookmarked: getAllBookmarked,
	addToBookmarked: addToBookmarked,
	getBookmarkedMovie: getBookmarkedMovie,

	removeFromBookmark: removeFromBookmark,
	
	getAllWatched: getAllWatched,
	addToWatched: addToWatched,
	getWatchedMovie: getWatchedMovie
};

module.exports = moduleexports;

function getAllBookmarked(req, res, next) {
	debug('bookmarkApi getAllBookmarked()');
	if (req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			debug('   send response : ');
			var output = [];
			_.forEach(result, function(r) {
				output.push(r.movieId);
			});
			res.send(output);
		}

		bookmark.findBookmared(req.session.loggedUser.userId).then(sendData);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function addToBookmarked(req, res, next) {
	debug('bookmarkApi addToBookmarked()');
	var movieId = req.body.imdbId;
	if (movieId && req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData() {
			debug('   send response : ');
			res.send({});
		}
		bookmark.changeToBookmarked(req.session.loggedUser.userId, movieId).then(sendData);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function getBookmarkedMovie(req, res, next) {
	debug('bookmarkApi getBookmarkedMovie()');

	if (req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			debug('   send response : ');
			res.send(result);
		}

		function afterGetMovieIds(result) {
			var movieIds = [];
			_.forEach(result, function (bm) {
				movieIds.push(bm.movieId);
			});

			movie.findByImdbIDs(movieIds).then(sendData);
		}

		bookmark.findBookmared(req.session.loggedUser.userId).then(afterGetMovieIds);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function removeFromBookmark(req, res, next) {
	debug('bookmarkApi removeFromBookmark()');
	var movieId = req.query.movieId

	if (movieId && req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			debug('   send response : ');
			res.send({});
		}

		bookmark.changeToUnbookmark(req.session.loggedUser.userId, movieId).then(sendData);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function getAllWatched(req, res, next) {
	debug('bookmarkApi getAllWatched()');
	if (req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			debug('   send response : ');
			var output = [];
			_.forEach(result, function(r) {
				output.push(r.movieId);
			});
			res.send(output);
		}

		bookmark.findWatched(req.session.loggedUser.userId).then(sendData);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function addToWatched(req, res, next) {
	debug('bookmarkApi addToWatched()');
	var movieId = req.body.imdbId;
	if (movieId && req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData() {
			debug('   send response : ');
			res.send({});
		}
		bookmark.changeToWatched(req.session.loggedUser.userId, movieId).then(sendData);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function getWatchedMovie(req, res, next) {
	debug('bookmarkApi getWatchedMovie()');

	if (req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			debug('   send response : ');
			res.send(result);
		}

		function afterGetMovieIds(result) {
			var movieIds = [];
			_.forEach(result, function (bm) {
				movieIds.push(bm.movieId);
			});

			movie.findByImdbIDs(movieIds).then(sendData);
		}

		bookmark.findWatched(req.session.loggedUser.userId).then(afterGetMovieIds);
	} else {
		debug('   not processed');
		res.send({});
	}
}
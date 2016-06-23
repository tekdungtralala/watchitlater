var debug = require('debug')('watchitlater:server');
var bookmark = require('../entity/bookmark');
var movie = require('../entity/movie');
var _ = require('lodash');

var moduleexports = {
	addToBookmark: addToBookmark,
	removeFromBookmark: removeFromBookmark,
	getAllBookmarks: getAllBookmarks,
	getBookmarkedMovie: getBookmarkedMovie
};

module.exports = moduleexports;

function getAllBookmarks(req, res, next) {
	debug('bookmarkApi getAllBookmarks()');
	if (req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			debug('   send response : ');
			var output = [];
			_.forEach(result, function(r) {
				output.push(r.movieId);
			});
			res.send(output);
		}

		bookmark.findBookmarks(req.session.loggedUser.userId).then(sendData);
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

		bookmark.removeBookmark(req.session.loggedUser.userId, movieId).then(sendData);
	} else {
		debug('   not processed');
		res.send({});
	}
}

function addToBookmark(req, res, next) {
	debug('bookmarkApi addToBookmark()');
	var movieId = req.body.imdbId;
	if (movieId && req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData() {
			debug('   send response : ');
			res.send({});
		}
		bookmark.saveOrUpdate(req.session.loggedUser.userId, movieId).then(sendData);
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

		bookmark.findBookmarks(req.session.loggedUser.userId).then(afterGetMovieIds);
	} else {
		debug('   not processed');
		res.send({});
	}
}
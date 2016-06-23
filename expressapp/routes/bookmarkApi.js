var debug = require('debug')('watchitlater:server');
var bookmark = require('../entity/bookmark');
var _ = require('lodash');

var moduleexports = {
	addToBookmark: addToBookmark,
	removeFromBookmark: removeFromBookmark,
	getAllBookmarks: getAllBookmarks
};

module.exports = moduleexports;

function getAllBookmarks(req, res, next) {
	debug('bookmarkApi getAllBookmarks()');
	if (req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			var output = [];
			_.forEach(result, function(r) {
				output.push(r.movieId);
			});
			res.send(output);
		}

		bookmark.findBookmarks(req.session.loggedUser.userId).then(sendData);
	} else {
		res.send({});
	}
}

function removeFromBookmark(req, res, next) {
	debug('bookmarkApi removeFromBookmark()');
	var movieId = req.query.movieId

	if (movieId && req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			res.send({});
		}

		bookmark.removeBookmark(req.session.loggedUser.userId, movieId).then(sendData);
	} else {
		res.send({});
	}
}

function addToBookmark(req, res, next) {
	debug('bookmarkApi addToBookmark()');
	var userData = req.body;
	var movieId = userData.imdbId;	

	if (movieId && req.session && req.session.loggedUser && req.session.loggedUser.userId) {
		function sendData(result) {
			result.userId = '';
			res.send(result);
		}

		bookmark.saveOrUpdate(req.session.loggedUser.userId, movieId).then(sendData);
	} else {
		res.send({});
	}
}
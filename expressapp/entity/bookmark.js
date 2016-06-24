var debug = require('debug')('watchitlater:server');
var Q = require('q');
var mongoose = require('mongoose');

var BookmarkSchema = new mongoose.Schema({
	updatedAt: {
		type: Date,
		required: true
	},
	userId: {
		type: String,
		trim: true,
		required: true
	},
	movieId: {
		type: String,
		trim: true,
		required: true
	},
	status: {
		type: String,
		trim: true,
		required: true
	}
});

var Bookmark = mongoose.model('Bookmark', BookmarkSchema);

var bookmarkModule = {
	findBookmared: findBookmared,
	changeToBookmarked: changeToBookmarked,

	changeToUnbookmark: changeToUnbookmark,

	findWatched: findWatched,
	changeToWatched: changeToWatched
};
module.exports = bookmarkModule;


function findBookmared(userId) {
	debug('Bookmark findBookmared()');

	var deferred = Q.defer();
	var query = {userId: userId, status: 'bookmarked'};
	Bookmark.find(query, null, null, function(err, doc) {
		if (err) debug('error ', err);
		debug('  total data = ' + doc.length);
		deferred.resolve(doc);
	});

	return deferred.promise;
}

function changeToBookmarked(userId, movieId) {
	debug('Bookmark changeToBookmarked() ' + movieId, userId);
	var deferred = Q.defer();
	var query = {userId: userId, movieId: movieId};
	var data = {userId: userId, movieId: movieId, status: 'bookmarked'};

	Bookmark.update(query, data, {upsert: true}, function(err) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve(true);
	});
	return deferred.promise;
}

function changeToUnbookmark(userId, movieId) {
	debug('Bookmark changeToUnbookmark() ' + movieId, userId);
	var deferred = Q.defer();
	var query = {userId: userId, movieId: movieId};
	var data = {userId: userId, movieId: movieId, status: 'un-bookmark'};

	Bookmark.update(query, data, {upsert: true}, function(err) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve(true);
	});

	return deferred.promise;
}

function findWatched(userId) {
	debug('Bookmark findWatched()');

	var deferred = Q.defer();
	var query = {userId: userId, status: 'watched'};
	Bookmark.find(query, null, null, function(err, doc) {
		if (err) debug('error ', err);
		debug('  total data = ' + doc.length);
		deferred.resolve(doc);
	});

	return deferred.promise;
}

function changeToWatched(userId, movieId) {
	debug('Bookmark changeToWatched() ' + movieId, userId);
	var deferred = Q.defer();
	var query = {userId: userId, movieId: movieId};
	var data = {userId: userId, movieId: movieId, status: 'watched'};

	Bookmark.update(query, data, {upsert: true}, function(err) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve(true);
	});
	return deferred.promise;
}
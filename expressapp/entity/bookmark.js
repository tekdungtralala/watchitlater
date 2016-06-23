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
	}
});

var Bookmark = mongoose.model('Bookmark', BookmarkSchema);

var bookmarkModule = {
	saveOrUpdate: saveOrUpdate,
	findBookmarks: findBookmarks,
	removeBookmark: removeBookmark
};
module.exports = bookmarkModule;

function findBookmarks(userId) {
	debug('Bookmark findBookmarks()');

	var deferred = Q.defer();
	var query = {userId: userId};
	Bookmark.find(query, null, null, function(err, doc) {
		if (err) debug('error ', err);
		debug('  bookmarks = ' + doc.length);
		deferred.resolve(doc);
	});

	return deferred.promise;
}

function saveOrUpdate(userId, movieId) {
	debug('Bookmark saveOrUpdate() ' + movieId, userId);
	var deferred = Q.defer();
	var query = {userId: userId, movieId: movieId};
	var opt = {upsert: true};

	Bookmark.findOneAndUpdate(query, query, opt, function(err, data) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve(data);
	});
	return deferred.promise;
}

function removeBookmark(userId, movieId) {
	debug('Bookmark removeBookmark() ' + movieId, userId);
	var deferred = Q.defer();
	var query = {userId: userId, movieId: movieId};

	Bookmark.findOneAndRemove(query, null, function(err) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve(true);
	});

	return deferred.promise;
}


"use strict";
var Q = require('q');
var Bookmark = require('./entity/Bookmark');
var debug = require('debug')('watchitlater:server:facade:bookmark');
var bookmarkModule = {
    findBookmared: findBookmared,
    changeToBookmarked: changeToBookmarked,
    changeToUnbookmark: changeToUnbookmark,
    findWatched: findWatched,
    changeToWatched: changeToWatched
};
function findBookmared(userId) {
    debug('findBookmared()');
    var deferred = Q.defer();
    var query = { userId: userId, status: 'bookmarked' };
    Bookmark.find(query, null, null, function (err, docs) {
        debug('after find');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('total docs.length=' + docs.length);
            deferred.resolve(docs);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function changeToBookmarked(userId, movieId) {
    debug('changeToBookmarked() ' + movieId + ', ' + userId);
    var deferred = Q.defer();
    var query = { userId: userId, movieId: movieId };
    var data = { userId: userId, movieId: movieId, status: 'bookmarked' };
    Bookmark.update(query, data, { upsert: true }, function (err) {
        debug('after update');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('saved');
            deferred.resolve(true);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function changeToUnbookmark(userId, movieId) {
    debug('changeToUnbookmark() ' + movieId + ', ' + userId);
    var deferred = Q.defer();
    var query = { userId: userId, movieId: movieId };
    var data = { userId: userId, movieId: movieId, status: 'un-bookmark' };
    Bookmark.update(query, data, { upsert: true }, function (err) {
        debug('after update');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('saved ');
            deferred.resolve(true);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function findWatched(userId) {
    debug('findWatched()');
    var deferred = Q.defer();
    var query = { userId: userId, status: 'watched' };
    Bookmark.find(query, null, null, function (err, docs) {
        debug('after find');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('  total docs.length=' + docs.length);
            deferred.resolve(docs);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function changeToWatched(userId, movieId) {
    debug('changeToWatched() ' + movieId + ', ' + userId);
    var deferred = Q.defer();
    var query = { userId: userId, movieId: movieId };
    var data = { userId: userId, movieId: movieId, status: 'watched' };
    Bookmark.update(query, data, { upsert: true }, function (err) {
        debug('after update');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('saved ');
            deferred.resolve(true);
        }
    });
    debug('return promise');
    return deferred.promise;
}
module.exports = bookmarkModule;

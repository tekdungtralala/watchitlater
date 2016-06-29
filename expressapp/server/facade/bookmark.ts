/// <reference path="../../../typings/tsd.d.ts" />

import mongoose = require('mongoose');
import Q = require('q');

import iBookmarkModel = require('./model/iBookmarkModel')
import Bookmark = require('./entity/Bookmark');

let debug: debug.IDebug = require('debug')('watchitlater:server:bookmark');

let bookmarkModule = {
	findBookmared: findBookmared,
	changeToBookmarked: changeToBookmarked,

	changeToUnbookmark: changeToUnbookmark,

	findWatched: findWatched,
	changeToWatched: changeToWatched
}

export = bookmarkModule

function findBookmared(userId: string): Q.Promise<iBookmarkModel[]> {
	debug('findBookmared()');

	var deferred: Q.Deferred<iBookmarkModel[]> = Q.defer<iBookmarkModel[]>();
	var query = {userId: userId, status: 'bookmarked'};
	Bookmark.find(query, null, null, function(err, docs) {
		debug('after find');
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('total docs.length=' + docs.length);
			deferred.resolve(docs);
		}
	});

	debug('return promise');
	return deferred.promise;
}

function changeToBookmarked(userId: string, movieId: string): Q.Promise<boolean> {
	debug('changeToBookmarked() ' + movieId + ', ' + userId);
	var deferred: Q.Deferred<boolean> = Q.defer<boolean>();
	var query = {userId: userId, movieId: movieId};
	var data = {userId: userId, movieId: movieId, status: 'bookmarked'};

	Bookmark.update(query, data, {upsert: true}, function(err) {
		debug('after update');
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('saved');
			deferred.resolve(true);
		}
	});

	debug('return promise');
	return deferred.promise;
}

function changeToUnbookmark(userId: string, movieId: string): Q.Promise<boolean> {
	debug('changeToUnbookmark() ' + movieId + ', ' + userId);
	var deferred:Q.Deferred<boolean> = Q.defer<boolean>();
	var query = {userId: userId, movieId: movieId};
	var data = {userId: userId, movieId: movieId, status: 'un-bookmark'};

	Bookmark.update(query, data, {upsert: true}, function(err) {
		debug('after update');
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('saved ');
			deferred.resolve(true);
		}
	});

	debug('return promise');
	return deferred.promise;
}

function findWatched(userId: string): Q.Promise<iBookmarkModel[]> {
	debug('findWatched()');

	var deferred: Q.Deferred<iBookmarkModel[]> = Q.defer<iBookmarkModel[]>();
	var query = {userId: userId, status: 'watched'};
	Bookmark.find(query, null, null, function(err, docs) {
		debug('after find');
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('  total docs.length=' + docs.length);
			deferred.resolve(docs);
		}
	});

	debug('return promise');
	return deferred.promise;
}

function changeToWatched(userId: string, movieId: string): Q.Promise<boolean> {
	debug('changeToWatched() ' + movieId + ', ' + userId);
	var deferred: Q.Deferred<boolean> = Q.defer<boolean>();
	var query = {userId: userId, movieId: movieId};
	var data = {userId: userId, movieId: movieId, status: 'watched'};

	Bookmark.update(query, data, {upsert: true}, function(err) {
		debug('after update');
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('saved ');
			deferred.resolve(true);
		}
	});

	debug('return promise');
	return deferred.promise;
}
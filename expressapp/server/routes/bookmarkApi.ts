/// <reference path="../../../typings/tsd.d.ts" />

interface AppReq extends express.Request {
	test: string
	query: {
		viewAs: string,
		movieId: string
	}
}

import express = require('express');

import movie = require('../facade/movie');
import bookmark = require('../facade/bookmark');
import _ = require('lodash');

let debug: debug.IDebug = require('debug')('watchitlater:server:bookmarkApi');

let moduleExport = {
	getAllBookmarked: getAllBookmarked,
	addToBookmarked: addToBookmarked,
	getBookmarkedMovie: getBookmarkedMovie,

	removeFromBookmark: removeFromBookmark,
	
	getAllWatched: getAllWatched,
	addToWatched: addToWatched,
	getWatchedMovie: getWatchedMovie
}

export = moduleExport

function getAllBookmarked(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('GET /bookmarks');
	if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.findBookmared(req.session['loggedUser'].userId).then(sendData).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}

	function sendData(result: any) {
		debug('send response : ');
		var output: Array<String> = [];
		_.forEach(result, function(r) {
			output.push(r.movieId);
		});
		res.send(output);
	}
}

function addToBookmarked(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('POST /bookmarks');
	var movieId = req.body.imdbId;
	if (movieId && req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.changeToBookmarked(req.session['loggedUser'].userId, movieId).then(sendData).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}

	function sendData() {
		debug('send response : ');
		res.send({});
	}
}

function getBookmarkedMovie(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('GET /bookmarks/movie');

	if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.findBookmared(req.session['loggedUser'].userId).then(afterGetMovieIds).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}

	function sendData(result: any) {
		debug('send response : ');
		res.send(result);
	}

	function afterGetMovieIds(result: any) {
		var movieIds: Array<string> = [];
		_.forEach(result, function (bm) {
			movieIds.push(bm.movieId);
		});

		movie.findByImdbIDs(movieIds).then(sendData);
	}
}

function removeFromBookmark(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('DELETE /bookmarks');
	var movieId = req.query.movieId

	if (movieId && req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.changeToUnbookmark(req.session['loggedUser'].userId, movieId).then(sendData).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}
	function sendData(result: any) {
		debug('send response : ');
		res.send({});
	}
}

function getAllWatched(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('GET /watched');
	if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.findWatched(req.session['loggedUser'].userId).then(sendData).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}

	function sendData(result: any) {
		debug('send response : ');
		var output: Array<string> = [];
		_.forEach(result, function(r) {
			output.push(r.movieId);
		});
		res.send(output);
	}
}

function addToWatched(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('POST /watched');
	var movieId = req.body.imdbId;
	if (movieId && req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.changeToWatched(req.session['loggedUser'].userId, movieId).then(sendData).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}
	function sendData() {
		debug('send response : ');
		res.send({});
	}
}

function getWatchedMovie(req: AppReq, res: express.Response, next: express.NextFunction) {
	debug('GET /watched/movie');

	if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
		bookmark.findWatched(req.session['loggedUser'].userId).then(afterGetMovieIds).catch(next);;
	} else {
		debug('not processed');
		res.send({});
	}
	function sendData(result: any) {
		debug('send response : ');
		res.send(result);
	}

	function afterGetMovieIds(result: any) {
		var movieIds: Array<string> = [];
		_.forEach(result, function (bm) {
			movieIds.push(bm.movieId);
		});

		movie.findByImdbIDs(movieIds).then(sendData);
	}
}
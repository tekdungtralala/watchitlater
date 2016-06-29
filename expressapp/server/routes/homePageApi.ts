/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');

import movie = require('../facade/movie');
import iMovieModel = require('../facade/model/iMovieModel')

let debug: debug.IDebug = require('debug')('watchitlater:server:homePageApi');

let moduleExport = {
	getLatestBoxOffice: getLatestBoxOffice,
	getLatestTopMovie: getLatestTopMovie
}

export = moduleExport

function getLatestTopMovie(req: express.Request, res: express.Response, next: express.NextFunction) {
	debug('GET /getLatestTopMovie');
	var skip = req.query.skip ? req.query.skip : 0;
	var limit = req.query.limit ? req.query.limit : 5;
	debug('skip=' + skip + ', limit=' + limit);

	function sendData(result: iMovieModel[]) {
		debug('sendata() result.length = ' + result.length);
		res.send(result);
	}

	debug('call movie.getLatestTopMovie()');
	movie.getLatestTopMovie(skip, limit)
		.then(sendData)
		.catch(next);
}

function getLatestBoxOffice(req: express.Request, res: express.Response, next: express.NextFunction) {
	debug('GET /getLatestBoxOffice');
	function sendData(result: iMovieModel[]) {
		debug('sendata() result.legnth = ' + result.length);
		res.send(result);
	}

	debug('call movie.getLatestBoxOffice()');
	movie.getLatestBoxOffice()
		.then(sendData)
		.catch(next);
}

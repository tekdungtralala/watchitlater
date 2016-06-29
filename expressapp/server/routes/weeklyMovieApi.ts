/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import moment = require('moment');

import weeklyMovieUtil = require('../util/weeklyMovieUtil');
import appUtil = require('../util/appUtil');
import weeklyMovie = require('../facade/weeklyMovie');
import movie = require('../facade/movie');
import iWeeklyMovieModel = require('../facade/model/iWeeklyMovieModel');
import iMovieModel = require('../facade/model/iMovieModel');

let debug: debug.IDebug = require('debug')('watchitlater:server:weeklyMovieApi');

let exportModule = {
	weeklymoviePost: weeklymoviePost,
	weeklymovieGet: weeklymovieGet
}

export = exportModule

function weeklymovieGet(req: express.Request, res: express.Response, next: express.NextFunction) {
	debug('GET /weeklymovie');
	let currDate: Date = generateCurrDate(req.query.date);
	debug('  currDate = ' + currDate);

	findWeeklymovie(currDate, res, next);
}

function weeklymoviePost(req: express.Request, res: express.Response, next: express.NextFunction) {
	debug('POST /weeklymovie');
	var currDate = generateCurrDate(req.query.date);
	debug('  currDate = ' + currDate);

	function doFindWeeklymovie() {
		findWeeklymovie(currDate, res, next);
	}

	weeklyMovieUtil
		.fetchWeeklyMovie(currDate)
		.then(doFindWeeklymovie);
}

function findWeeklymovie(currDate: Date, res: express.Response, next: express.NextFunction) {
	var fldow = appUtil.getFirstLastDOW(currDate);
	debug('findWeeklymovie() ');
	debug('  fldow = ');
	debug(fldow);
	

	function afterGetMovieIds(result: iWeeklyMovieModel) {
		debug('afterGetMovieIds(result) ');
		debug(result);
		if (result)
			return movie.findByImdbIDs(result.movieIds);
		else
			return {};
	}

	function sendData(result: iWeeklyMovieModel) {
		res.send(result);
	}

	weeklyMovie
		.findWeeklyMovie(fldow.fdow, fldow.ldow)
		.then(afterGetMovieIds)
		.then(sendData)
		.catch(next);
}

function generateCurrDate(date: string): Date {
	debug('  date = ' + date);
	var DATE_FORMAT = 'YYYY-MM-DD';
	if (!date) {
		date = moment(new Date()).format(DATE_FORMAT);
	};

	return moment(date, DATE_FORMAT).toDate();
}

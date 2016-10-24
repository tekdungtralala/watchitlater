/// <reference path="../../../typings/tsd.d.ts" />

import mongoose = require('mongoose');
import Q = require('q');
import http = require('http');
import cheerio = require('cheerio');
import moment = require('moment');

import movie = require('./movie');
import appConfig = require('./appConfig');
import weeklyMovie = require('./weeklyMovie');
import appUtil = require('../util/appUtil');
import weeklyMovieUtil = require('../util/weeklyMovieUtil');
import iMovieModel = require('./model/iMovieModel');
import iWeeklyMovieModel = require('./model/iWeeklyMovieModel');

let debug: debug.IDebug = require('debug')('watchitlater:server:facade:initEntity');

let moduleExport = {
	doInitialize: doInitialize
}
export = moduleExport;

var movieIds: Array<string> = [];
var index = 0;
var titleSplitter: string = null;

function doInitialize(): Q.Promise<boolean> {
	debug('doInitialize()');
	var d = Q.defer<boolean>();
	var latestBOUrl = 'http://www.imdb.com/chart/';

	fetchlatestBO()
		// .then(processData)
		// .then(afterProcessBO)
		// .then(fetchLatestTM)
		// .then(processData)
		// .then(afterProcessTM)
		.then(initWeeklyMovie)
		.then(function() {
			d.resolve(true);
		});

	debug('return promise');
	return d.promise;
}

function initWeeklyMovie(): Q.Promise<iWeeklyMovieModel> {
	debug('initWeeklyMovie()');
	return weeklyMovieUtil.fetchWeeklyMovie(new Date());
}

function processData(html: string): Q.Promise<boolean> {
	debug('processData()');
	movieIds = [];
	index = 0;

	var deferred: Q.Deferred<boolean> = Q.defer<boolean>();
	var $ = cheerio.load(html);
	$('table.chart.full-width tbody tr td.posterColumn').each(function(i, elm) {
		var $tr = cheerio.load($(this).html());
		var href = $tr('a').attr('href');
		var movieId = href.split('/title/')[1].split(titleSplitter)[0];
		movieIds.push(movieId);
	});

	function iterateMovieId() {
		if (index === movieIds.length) {
			resolvePromise();
			return;
		}

		var movieId = movieIds[index];
		index++;
		var url = 'http://www.omdbapi.com/?i=' + movieId + '&plot=full&r=json';
		appUtil.fetchHtml(url)
			.then(processMovieData)
			.then(iterateMovieId);
	}

	function resolvePromise() {
		deferred.resolve(true);
	}

	iterateMovieId();
	return deferred.promise;
}

function processMovieData(data: any): Q.Promise<iMovieModel> {
	debug('processMovieData()');
	var obj = JSON.parse(data);
	return movie.createOrUpdate(obj);
}

function afterProcessBO(): Q.Promise<boolean> {
	debug('afterProcessBO()');
	return appConfig.updateLatestBoxOffice(movieIds);
}

function afterProcessTM(): Q.Promise<boolean> {
	debug('afterProcessTM()');
	return appConfig.updateLatestTopMovies(movieIds);
}

function fetchlatestBO(): Q.Promise<string> {
	debug('fetchlatestBO()');
	titleSplitter = '?';

	var url = 'http://www.imdb.com/chart/';
	return appUtil.fetchHtml(url);
}

function fetchLatestTM(): Q.Promise<string> {
	debug('fetchLatestTM()');
	titleSplitter = '/?';

	var url = 'http://www.imdb.com/chart/top';
	return appUtil.fetchHtml(url);
}

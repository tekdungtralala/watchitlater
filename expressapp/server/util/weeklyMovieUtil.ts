/// <reference path="../../../typings/tsd.d.ts" />

import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import appUtil = require('./appUtil');
import movie = require('../facade/movie');
import weeklyMovie = require('../facade/weeklyMovie');
import WeeklyMovie = require('../facade/entity/WeeklyMovie');
import iWeeklyMovieModel = require('../facade/model/iWeeklyMovieModel')

let debug: debug.IDebug = require('debug')('watchitlater:server:weeklyMovieUtil');

let exportModule = {
	fetchWeeklyMovie: fetchWeeklyMovie
}

export = exportModule

function fetchWeeklyMovie(date: Date): Q.Promise<iWeeklyMovieModel> {
	var fldow = appUtil.getFirstLastDOW(date);
	var sortdate = moment(fldow.fdow).format('YYYY-MM-DD');
	debug('fetchWeeklyMovie() sortdate=' + sortdate)
	var url = 'http://www.boxofficemojo.com/daily/chart/?sortdate=' + sortdate;
	debug('url= ' + url);

	function processWeeklyMovie(html: string): Q.Promise<string[]> {
		debug('processWeeklyMovie() html.length=' + html.length);
		var movieIds: Array<string> = [];
		var movieNames: Array<string> = [];
		var index = 0;

		var deferred = Q.defer<string[]>();
		var $ = cheerio.load(html);
		$('#body center table tr td table tr td:nth-child(2) b a').each(function(i, elm) {
			var movieName = $(this).html().trim().toLowerCase();
			if (movieName.split(':').length > 1)
				movieName = movieName.split(':')[1];
			movieNames.push(movieName);
		});
		debug('total movies=' + movieNames.length);

		function iterateMovieName() {
			if (index === movieNames.length) {
				resolvePromise();
				return;
			}
			debug('iterateMovieName() index=' + index);

			var movieName = movieNames[index];
			index++;
			var url = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=full&r=json';
			appUtil.fetchHtml(url)
				.then(processMovieData)
				.then(afterSavedMovie)
				.then(iterateMovieName);
		}

		function processMovieData(data: string) {
			var obj = JSON.parse(data);
			return movie.createOrUpdate(obj);
		}

		function afterSavedMovie(data: any) {
			if (data && data.imdbID) {
				movieIds.push(data.imdbID);
			}
		}

		function resolvePromise() {
			debug('resolvePromise()')
			deferred.resolve(movieIds);
		}

		iterateMovieName();
		return deferred.promise;
	}

	function afterProcessWM(movieIds: string[]): Q.Promise<iWeeklyMovieModel> {
		let data = new WeeklyMovie();
		data.firstDayOfWeek = fldow.fdow;
		data.lastDayOfWeek = fldow.ldow;
		data.movieIds = movieIds

		return weeklyMovie.createOrUpdate(data);
	}

	debug('weeklyMovieUtil fetchWeeklyMovie() call appUtil.fetchHtml(url)');
	return appUtil
		.fetchHtml(url)
		.then(processWeeklyMovie)
		.then(afterProcessWM);
}
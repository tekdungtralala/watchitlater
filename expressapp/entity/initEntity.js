var debug = require('debug')('watchitlater:server');
var http = require('http');
var cheerio = require('cheerio');
var Q = require('q');
var moment = require('moment');

var movie = require('./movie');
var appConfig = require('./appConfig');
var weeklyMovie = require('./weeklyMovie');
var weeklyMovieUtil = require('../util/weeklyMovieUtil');
var appUtil = require('../util/appUtil');

var initEntity = {
	doInitialize: doInitialize
};

module.exports = initEntity;

var movieIds = [];
var index = 0;
var titleSplitter = null;
var movieNames = [];
var firstDayOfWeek = null;
var lastDayOfWeek = null;

function doInitialize() {
	var latestBOUrl = 'http://www.imdb.com/chart/';
	Q.fcall(fetchlatestBO)
		.then(processData)
		.then(afterProcessBO)
		.then(fetchLatestTM)
		.then(processData)
		.then(afterProcessTM)
		.then(initWeeklyMovie);
}

function initWeeklyMovie() {
	return weeklyMovieUtil.fetchWeeklyMovie(new Date());
}

function processData(html) {
	movieIds = [];
	index = 0;

	var deferred = Q.defer();
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
		deferred.resolve();
	}

	iterateMovieId();
	return deferred.promise;
}

function processMovieData(data) {
	var obj = JSON.parse(data);
	return movie.createOrUpdate(obj);
}

function afterProcessBO() {
	return appConfig.updateLatestBoxOffice(movieIds);
}

function afterProcessTM() {
	return appConfig.updateLatestTopMovies(movieIds);
}

function fetchlatestBO() {
	titleSplitter = '?';

	var url = 'http://www.imdb.com/chart/';
	return appUtil.fetchHtml(url);
}

function fetchLatestTM() {
	titleSplitter = '/?';

	var url = 'http://www.imdb.com/chart/top';
	return appUtil.fetchHtml(url);
}

var debug = require('debug')('watchitlater:server');
var moment = require('moment');

var weeklyMovieUtil = require('../util/weeklyMovieUtil');
var weeklymovie = require('../entity/weeklyMovie');
var movie = require('../entity/movie');
var appUtil = require('../util/appUtil');

var moduleexports = {
	weeklymoviePost: weeklymoviePost,
	weeklymovieGet: weeklymovieGet
};

module.exports = moduleexports;

function weeklymovieGet(req, res, next) {
	debug('/weeklymovie GET');
	var currDate = generateCurrDate(req.query.date);
	debug('  currDate = ' + currDate);

	findWeeklymovie(currDate, res);
}

function weeklymoviePost(req, res, next) {
	debug('/weeklymovie POST');
	var currDate = generateCurrDate(req.query.date);
	debug('  currDate = ' + currDate);

	function doFindWeeklymovie() {
		findWeeklymovie(currDate, res);
	}

	weeklyMovieUtil
		.fetchWeeklyMovie(currDate)
		.then(doFindWeeklymovie);
}

function findWeeklymovie(currDate, res) {
	var fldow = appUtil.getFirstLastDOW(currDate);
	debug('findWeeklymovie() fldow ', fldow);

	function afterGetMovieIds(result) {
		if (result)
			return movie.findByImdbIDs(result.movieIds);
		else
			return {};
	}

	function sendData(result) {
		res.send(result);
	}

	weeklymovie
		.findWeeklyMovie(fldow.fdow, fldow.ldow)
		.then(afterGetMovieIds)
		.then(sendData);
}

function generateCurrDate(date) {
	debug('  date = ' + date);
	var DATE_FORMAT = 'YYYY-MM-DD';
	if (!date) {
		date = moment(new Date()).format(DATE_FORMAT);
	};

	return moment(date, DATE_FORMAT)._d;
}

var debug = require('debug')('watchitlater:server');
var express = require('express');
var moment = require('moment');

var movie = require('../entity/movie');
var user = require('../entity/user');
var weeklymovie = require('../entity/weeklyMovie');
var appUtil = require('../util/appUtil');
var weeklyMovieUtil = require('../util/weeklyMovieUtil');

var router = express.Router();

router.get('/getLatestBoxOffice', function(req, res, next) {

	function sendData(result) {
		res.send(result);
	}

	movie.getLatestBoxOffice()
		.then(sendData);
});

router.get('/getLatestTopMovie', function(req, res, next) {
	debug('/getLatestTopMovie');
	var skip = req.query.skip ? req.query.skip : 0;
	var limit = req.query.limit ? req.query.limit : 5;
	debug('  skip=' + skip + ', limit=' + limit);

	function sendData(result) {
		res.send(result);
	}

	movie.getLatestTopMovie(skip, limit)
		.then(sendData);
});

router.post('/signin', function(req, res, next) {
	var userData = req.body;

	function sendData(result) {
		res.send(result);
	}

	user.saveOrUpdate(userData)
		.then(sendData);
});

router.get('/weeklymovie', function(req, res, next) {
	debug('/weeklymovie GET');
	var currDate = generateCurrDate(req.query.date)
	debug('  currDate = ' + currDate);

	findWeeklymovie(currDate, res);
});

function findWeeklymovie(currDate, res) {
	var fldow = appUtil.getFirstLastDOW(currDate);
	debug('findWeeklymovie() fldow ', fldow);

	function afterGetMovieIds(result) {
		if (result)
			return movie.findByImdbIDs(result.movieIds)
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

router.post('/weeklymovie', function(req, res, next) {
	debug('/weeklymovie POST');
	var currDate = generateCurrDate(req.query.date)
	debug('  currDate = ' + currDate);

	function doFindWeeklymovie() {
		findWeeklymovie(currDate, res);
	}

	weeklyMovieUtil
		.fetchWeeklyMovie(currDate)
		.then(doFindWeeklymovie);
});

function generateCurrDate(date) {
	debug('  date = ' + date);
	var DATE_FORMAT = 'YYYY-MM-DD';
	if (!date) {
		date = moment(new Date()).format(DATE_FORMAT);
	};
	return moment(date, DATE_FORMAT)._d;
}

module.exports = router;

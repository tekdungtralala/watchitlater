"use strict";
var moment = require('moment');
var weeklyMovieUtil = require('../util/weeklyMovieUtil');
var appUtil = require('../util/appUtil');
var weeklyMovie = require('../facade/weeklyMovie');
var movie = require('../facade/movie');
var debug = require('debug')('watchitlater:server:weeklyMovieApi');
var exportModule = {
    weeklymoviePost: weeklymoviePost,
    weeklymovieGet: weeklymovieGet
};
function weeklymovieGet(req, res, next) {
    debug('GET /weeklymovie');
    var currDate = generateCurrDate(req.query.date);
    debug('  currDate = ' + currDate);
    findWeeklymovie(currDate, res, next);
}
function weeklymoviePost(req, res, next) {
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
function findWeeklymovie(currDate, res, next) {
    var fldow = appUtil.getFirstLastDOW(currDate);
    debug('findWeeklymovie() ');
    debug('  fldow = ');
    debug(fldow);
    function afterGetMovieIds(result) {
        debug('afterGetMovieIds(result) ');
        debug(result);
        if (result)
            return movie.findByImdbIDs(result.movieIds);
        else
            return {};
    }
    function sendData(result) {
        res.send(result);
    }
    weeklyMovie
        .findWeeklyMovie(fldow.fdow, fldow.ldow)
        .then(afterGetMovieIds)
        .then(sendData)
        .catch(next);
}
function generateCurrDate(date) {
    debug('  date = ' + date);
    var DATE_FORMAT = 'YYYY-MM-DD';
    if (!date) {
        date = moment(new Date()).format(DATE_FORMAT);
    }
    ;
    return moment(date, DATE_FORMAT).toDate();
}
module.exports = exportModule;

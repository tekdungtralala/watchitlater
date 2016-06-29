"use strict";
var Q = require('q');
var cheerio = require('cheerio');
var movie = require('./movie');
var appConfig = require('./appConfig');
var appUtil = require('../util/appUtil');
var weeklyMovieUtil = require('../util/weeklyMovieUtil');
var debug = require('debug')('watchitlater:server:initEntity');
var moduleExport = {
    doInitialize: doInitialize
};
var movieIds = [];
var index = 0;
var titleSplitter = null;
function doInitialize() {
    debug('doInitialize()');
    var d = Q.defer();
    var latestBOUrl = 'http://www.imdb.com/chart/';
    fetchlatestBO()
        .then(initWeeklyMovie)
        .then(function () {
        d.resolve(true);
    });
    debug('return promise');
    return d.promise;
}
function initWeeklyMovie() {
    debug('initWeeklyMovie()');
    return weeklyMovieUtil.fetchWeeklyMovie(new Date());
}
function processData(html) {
    debug('processData()');
    movieIds = [];
    index = 0;
    var deferred = Q.defer();
    var $ = cheerio.load(html);
    $('table.chart.full-width tbody tr td.posterColumn').each(function (i, elm) {
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
function processMovieData(data) {
    debug('processMovieData()');
    var obj = JSON.parse(data);
    return movie.createOrUpdate(obj);
}
function afterProcessBO() {
    debug('afterProcessBO()');
    return appConfig.updateLatestBoxOffice(movieIds);
}
function afterProcessTM() {
    debug('afterProcessTM()');
    return appConfig.updateLatestTopMovies(movieIds);
}
function fetchlatestBO() {
    debug('fetchlatestBO()');
    titleSplitter = '?';
    var url = 'http://www.imdb.com/chart/';
    return appUtil.fetchHtml(url);
}
function fetchLatestTM() {
    debug('fetchLatestTM()');
    titleSplitter = '/?';
    var url = 'http://www.imdb.com/chart/top';
    return appUtil.fetchHtml(url);
}
module.exports = moduleExport;

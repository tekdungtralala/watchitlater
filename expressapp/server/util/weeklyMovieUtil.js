"use strict";
var Q = require('q');
var moment = require('moment');
var cheerio = require('cheerio');
var appUtil = require('./appUtil');
var movie = require('../facade/movie');
var weeklyMovie = require('../facade/weeklyMovie');
var WeeklyMovie = require('../facade/entity/WeeklyMovie');
var debug = require('debug')('watchitlater:server:weeklyMovieUtil');
var exportModule = {
    fetchWeeklyMovie: fetchWeeklyMovie
};
function fetchWeeklyMovie(date) {
    var fldow = appUtil.getFirstLastDOW(date);
    var sortdate = moment(fldow.fdow).format('YYYY-MM-DD');
    debug('fetchWeeklyMovie() sortdate=' + sortdate);
    var url = 'http://www.boxofficemojo.com/daily/chart/?sortdate=' + sortdate;
    debug('url= ' + url);
    function processWeeklyMovie(html) {
        debug('processWeeklyMovie() html.length=' + html.length);
        var movieIds = [];
        var movieNames = [];
        var index = 0;
        var deferred = Q.defer();
        var $ = cheerio.load(html);
        $('#body center table tr td table tr td:nth-child(2) b a').each(function (i, elm) {
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
            debug('omdbapi url = ' + url);
            appUtil.fetchHtml(url)
                .then(processMovieData)
                .then(afterSavedMovie)
                .then(iterateMovieName);
        }
        function processMovieData(data) {
            var obj = JSON.parse(data);
            return movie.createOrUpdate(obj);
        }
        function afterSavedMovie(data) {
            if (data && data.imdbID) {
                movieIds.push(data.imdbID);
            }
        }
        function resolvePromise() {
            debug('resolvePromise()');
            deferred.resolve(movieIds);
        }
        iterateMovieName();
        return deferred.promise;
    }
    function afterProcessWM(movieIds) {
        var data = new WeeklyMovie();
        data.firstDayOfWeek = fldow.fdow;
        data.lastDayOfWeek = fldow.ldow;
        data.movieIds = movieIds;
        return weeklyMovie.createOrUpdate(data);
    }
    debug('weeklyMovieUtil fetchWeeklyMovie() call appUtil.fetchHtml(url)');
    return appUtil
        .fetchHtml(url)
        .then(processWeeklyMovie)
        .then(afterProcessWM);
}
module.exports = exportModule;

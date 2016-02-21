var debug = require('debug')('watchitlater:server');
var moment = require('moment');
var cheerio = require('cheerio');
var Q = require('q');

var appUtil = require('./appUtil');
var movie = require('../entity/movie');
var weeklyMovie = require('../entity/weeklyMovie');

var moduleExports = {
	fetchWeeklyMovie: fetchWeeklyMovie
};

module.exports = moduleExports;

function fetchWeeklyMovie(date) {
	var fldow = appUtil.getFirstLastDOW(date);
	var sortdate = moment(fldow.fdow).format('YYYY-MM-DD');
	debug('fetchWeeklyMovie sortdate=' + sortdate);
	var url = 'http://www.boxofficemojo.com/daily/chart/?sortdate=' + sortdate;
	debug('  url= ' + url);

	function processWeeklyMovie(html) {
		var movieIds = [];
		var movieNames = [];
		var index = 0;

		var deferred = Q.defer();
		var $ = cheerio.load(html);
		$('#body center table tr td table tr td:nth-child(2) b a').each(function(i, elm) {
			var movieName = $(this).html().trim().toLowerCase();
			if (movieName.split(':').length > 1)
				movieName = movieName.split(':')[1];
			movieNames.push(movieName);
		});

		function iterateMovieName() {
			if (index === movieNames.length) {
				resolvePromise();
				return;
			}

			var movieName = movieNames[index];
			index++;
			var url = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=full&r=json';
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
			deferred.resolve(movieIds);
		}

		iterateMovieName();
		return deferred.promise;
	}

	function afterProcessWM(movieIds) {
		var data = {
			firstDayOfWeek: fldow.fdow,
			lastDayOfWeek: fldow.ldow,
			movieIds: movieIds
		};

		return weeklyMovie.createOrUpdate(data);
	}

	return appUtil
		.fetchHtml(url)
		.then(processWeeklyMovie)
		.then(afterProcessWM);
}

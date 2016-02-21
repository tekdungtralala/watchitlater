var debug = require('debug')('watchitlater:server');
var Q = require('q');
var mongoose = require('mongoose');

var WeeklyMovieSchema = new mongoose.Schema({
	updatedAt: {
		type: Date,
		required: true
	},
	firstDayOfWeek: {
		type: Date,
		required: true
	},
	lastDayOfWeek: {
		type: Date,
		required: true
	},
	movieIds: {
		type: Array,
		trim: true,
		required: true
	}
});

var WeeklyMovie = mongoose.model('WeeklyMovie', WeeklyMovieSchema);

var wmModule = {
	createOrUpdate: createOrUpdate,
	findWeeklyMovie: findWeeklyMovie
};
module.exports = wmModule;

function findWeeklyMovie(fdow, ldow) {
	var deferred = Q.defer();
	setupDate(fdow);
	setupDate(ldow);
	debug('WeeklyMovie findWeeklyMovie() ' + fdow + ', ' + ldow);
	var query = {
		firstDayOfWeek: fdow,
		lastDayOfWeek: ldow
	};

	WeeklyMovie.findOne(query, {}, function(err, data) {
		if (err)
			debug('  error ', err);
		deferred.resolve(data);
	});

	return deferred.promise;
}

function createOrUpdate(data) {
	debug('WeeklyMovie createOrUpdate()');

	var deferred = Q.defer();
	if (data.firstDayOfWeek && data.lastDayOfWeek) {
		setupDate(data.firstDayOfWeek);
		setupDate(data.lastDayOfWeek);
		debug('  fdow = ' + data.firstDayOfWeek);
		debug('  ldow = ' + data.lastDayOfWeek);

		var query = {
			firstDayOfWeek: data.firstDayOfWeek,
			lastDayOfWeek: data.lastDayOfWeek
		};
		var opt = {upsert: true};
		WeeklyMovie.findOneAndUpdate(query, data, opt, function(err) {
			if (err)
				debug('  error ', err);
			else
				debug('  saved ');
			deferred.resolve(data);
		});
	} else {
		setTimeout(function() {
			deferred.resolve();
		}, 1);
	}

	return deferred.promise;
}

function setupDate(date) {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
}

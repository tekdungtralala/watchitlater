/// <reference path="../../../typings/tsd.d.ts" />

import mongoose = require('mongoose');
import Q = require('q');

import iWeeklyMovieModel = require('./model/iWeeklyMovieModel')
import WeeklyMovie = require('./entity/WeeklyMovie')

let debug: debug.IDebug = require('debug')('watchitlater:server:facade:weeklyMovie');

let wmModule = {
	createOrUpdate: createOrUpdate,
	findWeeklyMovie: findWeeklyMovie
}
export = wmModule

function findWeeklyMovie(fdow: Date, ldow: Date): Q.Promise<iWeeklyMovieModel> {
	var deferred: Q.Deferred<iWeeklyMovieModel>= Q.defer<iWeeklyMovieModel>();
	setupDate(fdow);
	setupDate(ldow);
	debug('WeeklyMovie findWeeklyMovie() ' + fdow + ', ' + ldow);
	var query = {
		firstDayOfWeek: fdow,
		lastDayOfWeek: ldow
	};

	WeeklyMovie.findOne(query, {}, function(err: any, data: iWeeklyMovieModel) {
		debug('after findOne')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('success data=');
			debug(data);
			deferred.resolve(data);
		}
	});

	return deferred.promise;
}

function createOrUpdate(data: iWeeklyMovieModel): Q.Promise<iWeeklyMovieModel> {
	debug('WeeklyMovie createOrUpdate()');

	var deferred: Q.Deferred<iWeeklyMovieModel> = Q.defer<iWeeklyMovieModel>();
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

		delete data['_id'];

		let newData = {
			firstDayOfWeek: data.firstDayOfWeek,
			lastDayOfWeek: data.lastDayOfWeek,
			movieIds: data.movieIds
		};

		WeeklyMovie.findOneAndUpdate(query, newData, opt, function(err, result) {
			debug('after findOneAndUpdate')
			if (err) {
				debug('error err=');
				debug(err);
				deferred.reject(err);
			} else {
				debug('success');
				deferred.resolve(data);
			}
		});
	} else {
		setTimeout(function() {
			deferred.reject(false);
		}, 1);
	}

	return deferred.promise;
}

function setupDate(date: Date) {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
}

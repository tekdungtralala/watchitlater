/// <reference path="../../../typings/tsd.d.ts" />

import mongoose = require('mongoose');
import Q = require('q');

import AppConfig = require('./entity/AppConfig');
import iAppConfigModel = require('./model/iAppConfigModel')

let debug: debug.IDebug = require('debug')('watchitlater:server:facade:appConfig');

let appModule = {
	updateLatestTopMovies: updateLatestTopMovies,
	updateLatestBoxOffice: updateLatestBoxOffice,
	getLatestBoxOffice: getLatestBoxOffice,
	getLatestTopMovie: getLatestTopMovie
}

export = appModule;


var LATEST_BO_KEY = 'latest-box-office';
var LATEST_TM_KEY = 'latest-top-movies';

function updateLatestBoxOffice(movieIds: string[]): Q.Promise<boolean> {
	debug('updateLatestBoxOffice() ' + movieIds);
	return findOneAndUpdate(LATEST_BO_KEY, movieIds);
}

function updateLatestTopMovies(movieIds: string[]): Q.Promise<boolean> {
	debug('updateLatestTopMovies() ' + movieIds);
	return findOneAndUpdate(LATEST_TM_KEY, movieIds);
}

function getLatestBoxOffice(): Q.Promise<string[]> {
	debug('getLatestBoxOffice()');
	return getValue(LATEST_BO_KEY);
}

function getLatestTopMovie(): Q.Promise<string[]>{
	debug('getLatestTopMovie()');
	return getValue(LATEST_TM_KEY);
}

function getValue(key: string): Q.Promise<string[]> {
	debug('getValue() ' +  key);
	var deferred: Q.Deferred<string[]> = Q.defer<string[]>();
	var query = {key: key};
	AppConfig.findOne(query, function(err: any, doc: iAppConfigModel) {
		debug('after findOne()');
		if (err) {
			debug('error ' + err);
			deferred.reject(err);
		} else {
			debug('resolve');
			deferred.resolve(doc.value);
		}
	});

	debug('return promise');
	return deferred.promise;
}

function findOneAndUpdate(key: string, value: string[]): Q.Promise<boolean> {
	debug('findOneAndUpdate() ');
	var deferred: Q.Deferred<boolean> = Q.defer<boolean>();
	var query = {key: key};
	var opt = {upsert: true};

	var data = {
		key: key,
		value: value,
		updatedAt: new Date()
	};

	AppConfig.findOneAndUpdate(query, data, opt, function(err) {
		debug('after findOneAndUpdate() ');
		if (err) {
			debug('  error ' + err);
			deferred.reject(err);
		} else {
			debug('  saved ');
			deferred.resolve(true);
		}
	});

	debug('return promise');
	return deferred.promise;
}
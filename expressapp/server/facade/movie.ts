/// <reference path="../../../typings/tsd.d.ts" />

import mongoose = require('mongoose');
import Q = require('q');

import appConfig = require('./appConfig');
import iMovieModel = require('./model/iMovieModel')
import Movie = require('./entity/Movie')

let debug: debug.IDebug = require('debug')('watchitlater:server:movie');

let movieModule = {
	findAllMovie: findAllMovie,
	updateMovie: updateMovie,
	createOrUpdate: createOrUpdate,
	getLatestBoxOffice: getLatestBoxOffice,
	getLatestTopMovie: getLatestTopMovie,
	findByImdbIDs: findByImdbIDs,
	isHasMovieWOImage: isHasMovieWOImage,
	findMoviesWOImage: findMoviesWOImage
};

export = movieModule;

function findMoviesWOImage(): Q.Promise<iMovieModel[]> {
	debug('findMoviesWOImage()');
	var deferred: Q.Deferred<iMovieModel[]> = Q.defer<iMovieModel[]>();

	var query = {isImageReady: false};

	Movie.find(query, null, null, function(err, docs) {
		debug('after find')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('movies docs.length = ' + docs.length);
			deferred.resolve(docs);
		}
	});

	debug('return promise')
	return deferred.promise;
}

function isHasMovieWOImage(): Q.Promise<number> {
	debug('isHasMovieWOImage()');
	var deferred: Q.Deferred<number> = Q.defer<number>();
	Movie.count({isImageReady: false}, function(err, total) {
		debug('after count')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('total = ' + total);
			deferred.resolve(total);
		}
	});

	debug('return promise')
	return deferred.promise;
}

function findByImdbIDs(imdbIds: Array<String>, skip?: number, limit?: number): Q.Promise<iMovieModel[]> {
	debug('findByImdbIDs() imdbIds.length = ' + imdbIds.length);
	let deferred: Q.Deferred<iMovieModel[]> = Q.defer<iMovieModel[]>();

	let query: any = {imdbID: {}};
	query.imdbID.$in = imdbIds;
	

	var opt: any = {
		sort: {imdbRating: -1}
	};
	if (skip) opt.skip = skip;
	if (limit) opt.limit = limit;

	Movie.find(query, null, opt, function(err: any, docs: iMovieModel[]) {
		debug('after find')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('movies docs.length = ' + docs.length);
			deferred.resolve(docs);
		}
	});

	debug('return promise')
	return deferred.promise;
}

function getLatestTopMovie(skip: number, limit: number): Q.Promise<iMovieModel[]> {
	debug('getLatestTopMovie()');

	function getMovieData(result: Array<String>) {
		debug('getMovieData(result)');
		debug('result.length = ' + result.length)
		return findByImdbIDs(result, skip, limit);
	}

	debug('call appConfig.getLatestTopMovie()')
	return appConfig.getLatestTopMovie()
		.then(getMovieData);
}

function getLatestBoxOffice(): Q.Promise<iMovieModel[]> {
	debug('getLatestBoxOffice()');

	function getMovieData(result: Array<String>) {
		debug('getMovieData(result) result.length=' + result.length);
		return findByImdbIDs(result);
	}

	debug('call appConfig.getLatestBoxOffice()')
	return appConfig.getLatestBoxOffice()
		.then(getMovieData);
}

function createOrUpdate(newData: iMovieModel): Q.Promise<iMovieModel> {
	debug('createOrUpdate() imdbId: ' + newData.imdbID + ', title:' + newData.Title + ', rating: ' + newData.imdbRating);
	debug(' poster: ' + newData.Poster);

	if (newData.imdbRating && !isNaN(parseFloat(newData.imdbRating.toString())) && isFinite(newData.imdbRating)) {
		newData.imdbRating = Number(newData.imdbRating);
	} else {
		newData.imdbRating = 0.0;
	}

	var deferred: Q.Deferred<iMovieModel> = Q.defer<iMovieModel>();
	var query = {imdbID: newData.imdbID};
	Movie.findOne(query, function(err, oldData) {
		debug('after find')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
			return;
		}

		if (oldData) {
			debug('  finded will update');
			updateData(oldData);
		} else {
			debug('  empty will created');
			createData();
		};

	});

	function createData() {
		debug('createData()');
		newData.isImageReady = false;
		newData.PosterImdb = newData.Poster;
		newData.Poster = '/static-assets/img/image-not-ready.png';

		Movie.create(newData, function(err, d) {
			if (err) {
				rejectPromise(err);
			} else {
				debug('success create')
				resolvePromise(d);
			}
		});
	}

	function updateData(oldData: iMovieModel) {
		var opt = {
			safe: true,
			upsert: true,
			multi: false,
			overwrite: true
		};
		var isImageReady: Boolean = null;
		var Poster: string = null;
		if (newData.isImageReady && true === newData.isImageReady) {
			Poster = newData.Poster;
			isImageReady = true;
		} else {
			Poster = oldData.Poster;
			isImageReady = oldData.isImageReady;
		}

		newData.Poster = Poster;
		newData.isImageReady = isImageReady;
		

		Movie.update(query, newData, opt, function(err) {
			if (err) {
				rejectPromise(err);
			} else {
				debug('success create')
				resolvePromise(newData);
			}
		});
	}

	function rejectPromise(err: any) {
		debug('error err=');
		debug(err);
		deferred.reject(err);
	}

	function resolvePromise(d: iMovieModel) {
		deferred.resolve(d);
	}

	debug('return promise')
	return deferred.promise;
}

function updateMovie(imdbId: string, movie: iMovieModel): Q.Promise<boolean> {
	debug('updateMovie()')
	var deferred: Q.Deferred<boolean> = Q.defer<boolean>();

	if (movie.imdbRating && !isNaN(parseFloat(movie.imdbRating.toString())) && isFinite(movie.imdbRating)) {
		movie.imdbRating = Number(movie.imdbRating);
	} else {
		movie.imdbRating = 0;
	}

	Movie.update({imdbID: imdbId}, movie, {multi: false}, function(err) {
		debug('err = ' + err)
		if (err) {
			deferred.reject(false);
		} else {
			deferred.resolve(true);
		}
	});

	return deferred.promise;
}

function findAllMovie(): Q.Promise<iMovieModel[]> {
	debug('findAllMovie()')
	let deferred: Q.Deferred<iMovieModel[]> = Q.defer<iMovieModel[]>();

	Movie.find({}, null, {}, function(err: any, docs: iMovieModel[]) {
		debug('after find')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('movies docs.length = ' + docs.length);
			deferred.resolve(docs);
		}
	});

	return deferred.promise;
}

function isFloat(n: any) {
	return Number(n) === n && n % 1 !== 0;
}

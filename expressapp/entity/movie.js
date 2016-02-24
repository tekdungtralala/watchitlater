var debug = require('debug')('watchitlater:server');
var Q = require('q');
var mongoose = require('mongoose');
var appConfig = require('./appConfig');
var appUtil = require('../util/appUtil');

var MovieSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Array
	},
	isImageReady: {
		type: Boolean
	},
	Title: {
		type: String,
		trim: true
	},
	Year: {
		type: String,
		trim: true
	},
	Released: {
		type: String,
		trim: true
	},
	Runtime: {
		type: String,
		trim: true
	},
	Genre: {
		type: String,
		trim: true
	},
	Director: {
		type: String,
		trim: true
	},
	Writer: {
		type: String,
		trim: true
	},
	Actors: {
		type: String,
		trim: true
	},
	Plot: {
		type: String,
		trim: true
	},
	Language: {
		type: String,
		trim: true
	},
	Country: {
		type: String,
		trim: true
	},
	Awards: {
		type: String,
		trim: true
	},
	Poster: {
		type: String,
		trim: true
	},
	PosterImdb: {
		type: String,
		trim: true
	},
	Metascore: {
		type: String,
		trim: true
	},
	imdbRating: {
		type: Number,
		trim: true
	},
	imdbID: {
		type: String,
		trim: true
	},
	Type: {
		type: String,
		trim: true
	}
});

var Movie = mongoose.model('Movie', MovieSchema);
var movieModule = {
	createOrUpdate: createOrUpdate,
	getLatestBoxOffice: getLatestBoxOffice,
	getLatestTopMovie: getLatestTopMovie,
	findByImdbIDs: findByImdbIDs,
	isHasMovieWOImage: isHasMovieWOImage,
	findMoviesWOImage: findMoviesWOImage
};

module.exports = movieModule;

function findMoviesWOImage() {
	debug('findMoviesWOImage()');
	var deferred = Q.defer();

	var query = {isImageReady: false};

	Movie.find(query, null, null, function(err, doc) {
		if (err) debug('error ', err);
		debug('  movies = ' + doc.length);
		deferred.resolve(doc);
	});

	return deferred.promise;
}

function isHasMovieWOImage() {
	debug('movie isHasMovieWOImage()');
	var deferred = Q.defer();
	Movie.count({isImageReady: false}, function(err, c) {
		if (err) debug('error ', err);
		debug('  total=' + c);
		deferred.resolve(c);
	});

	return deferred.promise;
}

function findByImdbIDs(imdbIds, skip, limit) {
	debug('movie findByImdbIDs() imdbIds.length = ' + imdbIds.length);
	var deferred = Q.defer();

	var query = {imdbID: {}};
	query.imdbID.$in = imdbIds;

	var opt = {
		sort: {imdbRating: -1}
	};
	if (skip) opt.skip = skip;
	if (limit) opt.limit = limit;

	Movie.find(query, null, opt, function(err, doc) {
		if (err) debug('error ', err);
		debug('  movies = ' + doc.length);
		deferred.resolve(doc);
	});

	return deferred.promise;
}

function getLatestTopMovie(skip, limit) {
	debug('movie getLatestTopMovie()');

	function getMovieData(result) {
		return findByImdbIDs(result, skip, limit);
	}

	return appConfig.getLatestTopMovie()
		.then(getMovieData);
}

function getLatestBoxOffice() {
	debug('movie getLatestBoxOffice()');

	function getMovieData(result) {
		return findByImdbIDs(result);
	}

	return appConfig.getLatestBoxOffice()
		.then(getMovieData);
}

function createOrUpdate(newData) {
	debug('movie createOrUpdate() ' + newData.imdbID + ', ' + newData.Title);

	var ratingNumber = Number(newData.imdbRating);
	if (isFloat(ratingNumber)) {
		newData.imdbRating = ratingNumber;
	} else {
		newData.imdbRating = 0.0;
	}

	var deferred = Q.defer();
	var query = {imdbID: newData.imdbID};
	Movie.findOne(query, function(err, oldData) {
		if (err) debug('  error ', err);

		if (oldData) {
			debug('  finded will update');
			updateData(oldData);
		} else {
			debug('  empty will created');
			createData();
		};

	});

	function createData() {
		newData.isImageReady = false;
		newData.PosterImdb = newData.Poster;
		newData.Poster = '/static-assets/img/image-not-ready.png';

		Movie.create(newData, function(err, d) {
			resolvePromize(d);
		});
	}

	function updateData(oldData) {
		var opt = {
			safe: true,
			upsert: true,
			multi: false,
			overwrite: true
		};
		var isImageReady = null;
		var Poster = null;
		if (newData.isImageReady && true === newData.isImageReady) {
			Poster = newData.Poster;
			isImageReady = true;
		} else {
			Poster = oldData.Poster;
			isImageReady = oldData.isImageReady;
		}

		newData.Poster = Poster;
		newData.isImageReady = isImageReady;

		Movie.update(query, newData, opt, function() {
			resolvePromize(newData);
		});
	}

	function resolvePromize(d) {
		deferred.resolve(d);
	}

	return deferred.promise;
}

function isFloat(n) {
	return Number(n) === n && n % 1 !== 0;
}

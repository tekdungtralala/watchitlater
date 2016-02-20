var debug = require('debug')('watchitlater:server');
var Q = require('q');
var mongoose = require('mongoose');
var appConfig = require('./appConfig');

var MovieSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Array
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
	getLatestTopMovie: getLatestTopMovie
};

module.exports = movieModule;

function getLatestTopMovie(skip, limit) {
	debug('getLatestTopMovie()');

	var deferred = Q.defer();
	function afterGetMovieIds(movieIds) {
		debug('  movieIds = ' + movieIds.length);

		var query = {imdbID: {}};
		query.imdbID.$in = movieIds;

		var opt = {
			sort: {imdbRating: -1},
			skip: skip,
			limit: limit
		};

		Movie.find(query, null, opt, function(err, doc) {
			if (err) debug('error ', err);
			debug('  movies = ' + doc.length);
			deferred.resolve(doc);
		});
	};

	appConfig.getLatestTopMovie().then(afterGetMovieIds);

	return deferred.promise;
}

function getLatestBoxOffice() {
	debug('getLatestBoxOffice()');

	var deferred = Q.defer();
	function afterGetMovieIds(movieIds) {
		debug('  movieIds = ' + movieIds.length);

		var query = {imdbID: {}};
		query.imdbID.$in = movieIds;

		Movie.find(query, function(err, doc) {
			if (err) debug('error ', err);
			debug('  movies = ' + doc.length);
			deferred.resolve(doc);

		});
	};

	appConfig.getLatestBoxOffice().then(afterGetMovieIds);

	return deferred.promise;
}

function createOrUpdate(data) {
	debug('Movie createOrUpdate() ' + data.imdbID);

	var ratingNumber = Number(data.imdbRating);
	if (isFloat(ratingNumber)) {
		data.imdbRating = ratingNumber;
	} else {
		data.imdbRating = 0.0;
	}

	var deferred = Q.defer();
	var query = {imdbID: data.imdbID};
	var opt = {upsert: true};
	Movie.findOneAndUpdate(query, data, opt, function(err) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve();
	});

	return deferred.promise;
}

function isFloat(n) {
	return Number(n) === n && n % 1 !== 0;
}

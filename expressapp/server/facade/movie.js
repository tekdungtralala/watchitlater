"use strict";
var Q = require('q');
var appConfig = require('./appConfig');
var Movie = require('./entity/Movie');
var debug = require('debug')('watchitlater:server:facade:movie');
var movieModule = {
    findAllMovie: findAllMovie,
    updateMovie: updateMovie,
    createOrUpdate: createOrUpdate,
    getLatestBoxOffice: getLatestBoxOffice,
    getLatestTopMovie: getLatestTopMovie,
    findByImdbIDs: findByImdbIDs,
    isHasMovieWOImage: isHasMovieWOImage,
    findMoviesWOImage: findMoviesWOImage
};
function findMoviesWOImage() {
    debug('findMoviesWOImage()');
    var deferred = Q.defer();
    var query = { isImageReady: false };
    Movie.find(query, null, null, function (err, docs) {
        debug('after find');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('movies docs.length = ' + docs.length);
            deferred.resolve(docs);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function isHasMovieWOImage() {
    debug('isHasMovieWOImage()');
    var deferred = Q.defer();
    Movie.count({ isImageReady: false }, function (err, total) {
        debug('after count');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('total = ' + total);
            deferred.resolve(total);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function findByImdbIDs(imdbIds, skip, limit) {
    debug('findByImdbIDs() imdbIds.length = ' + imdbIds.length);
    var deferred = Q.defer();
    var query = { imdbID: {} };
    query.imdbID.$in = imdbIds;
    var opt = {
        sort: { imdbRating: -1 }
    };
    if (skip)
        opt.skip = parseInt(skip);
    if (limit)
        opt.limit = parseInt(limit);
    Movie.find(query, null, opt, function (err, docs) {
        debug('after find');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('movies docs.length = ' + docs.length);
            deferred.resolve(docs);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function getLatestTopMovie(skip, limit) {
    debug('getLatestTopMovie()');
    function getMovieData(result) {
        debug('getMovieData(result)');
        debug('result.length = ' + result.length);
        return findByImdbIDs(result, skip, limit);
    }
    debug('call appConfig.getLatestTopMovie()');
    return appConfig.getLatestTopMovie()
        .then(getMovieData);
}
function getLatestBoxOffice() {
    debug('getLatestBoxOffice()');
    function getMovieData(result) {
        debug('getMovieData(result) result.length=' + result.length);
        return findByImdbIDs(result);
    }
    debug('call appConfig.getLatestBoxOffice()');
    return appConfig.getLatestBoxOffice()
        .then(getMovieData);
}
function createOrUpdate(newData) {
    debug('createOrUpdate() imdbId: ' + newData.imdbID + ', title:' + newData.Title + ', rating: ' + newData.imdbRating);
    debug(' poster: ' + newData.Poster);
    if (newData.imdbRating && !isNaN(parseFloat(newData.imdbRating.toString())) && isFinite(newData.imdbRating)) {
        newData.imdbRating = Number(newData.imdbRating);
    }
    else {
        newData.imdbRating = 0.0;
    }
    var deferred = Q.defer();
    var query = { imdbID: newData.imdbID };
    Movie.findOne(query, function (err, oldData) {
        debug('after find');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
            return;
        }
        if (oldData) {
            debug('  finded will update');
            updateData(oldData);
        }
        else {
            debug('  empty will created');
            createData();
        }
        ;
    });
    function createData() {
        debug('createData()');
        newData.isImageReady = false;
        newData.PosterImdb = newData.Poster;
        newData.Poster = '/static-assets/img/image-not-ready.png';
        Movie.create(newData, function (err, d) {
            if (err) {
                rejectPromise(err);
            }
            else {
                debug('success create');
                resolvePromise(d);
            }
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
        }
        else {
            Poster = oldData.Poster;
            isImageReady = oldData.isImageReady;
        }
        newData.Poster = Poster;
        newData.isImageReady = isImageReady;
        Movie.update(query, newData, opt, function (err) {
            if (err) {
                rejectPromise(err);
            }
            else {
                debug('success create');
                resolvePromise(newData);
            }
        });
    }
    function rejectPromise(err) {
        debug('error err=');
        debug(err);
        deferred.reject(err);
    }
    function resolvePromise(d) {
        deferred.resolve(d);
    }
    debug('return promise');
    return deferred.promise;
}
function updateMovie(imdbId, movie) {
    var deferred = Q.defer();
    if (movie.imdbRating && !isNaN(parseFloat(movie.imdbRating.toString())) && isFinite(movie.imdbRating)) {
        movie.imdbRating = Number(movie.imdbRating);
    }
    else {
        movie.imdbRating = 0;
    }
    Movie.update({ imdbID: imdbId }, movie, { multi: false }, function (err) {
        if (err) {
            deferred.reject(false);
        }
        else {
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}
function findAllMovie() {
    debug('findAllMovie()');
    var deferred = Q.defer();
    Movie.find({}, null, {}, function (err, docs) {
        debug('after find');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('movies docs.length = ' + docs.length);
            deferred.resolve(docs);
        }
    });
    return deferred.promise;
}
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
module.exports = movieModule;

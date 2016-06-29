"use strict";
var movie = require('../facade/movie');
var bookmark = require('../facade/bookmark');
var _ = require('lodash');
var debug = require('debug')('watchitlater:server:bookmarkApi');
var moduleExport = {
    getAllBookmarked: getAllBookmarked,
    addToBookmarked: addToBookmarked,
    getBookmarkedMovie: getBookmarkedMovie,
    removeFromBookmark: removeFromBookmark,
    getAllWatched: getAllWatched,
    addToWatched: addToWatched,
    getWatchedMovie: getWatchedMovie
};
function getAllBookmarked(req, res, next) {
    debug('GET /bookmarks');
    if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData(result) {
            debug('send response : ');
            var output = [];
            _.forEach(result, function (r) {
                output.push(r.movieId);
            });
            res.send(output);
        }
        bookmark.findBookmared(req.session['loggedUser'].userId).then(sendData).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
function addToBookmarked(req, res, next) {
    debug('POST /bookmarks');
    var movieId = req.body.imdbId;
    if (movieId && req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData() {
            debug('send response : ');
            res.send({});
        }
        bookmark.changeToBookmarked(req.session['loggedUser'].userId, movieId).then(sendData).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
function getBookmarkedMovie(req, res, next) {
    debug('GET /bookmarks/movie');
    if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData(result) {
            debug('send response : ');
            res.send(result);
        }
        function afterGetMovieIds(result) {
            var movieIds = [];
            _.forEach(result, function (bm) {
                movieIds.push(bm.movieId);
            });
            movie.findByImdbIDs(movieIds).then(sendData);
        }
        bookmark.findBookmared(req.session['loggedUser'].userId).then(afterGetMovieIds).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
function removeFromBookmark(req, res, next) {
    debug('DELETE /bookmarks');
    var movieId = req.query.movieId;
    if (movieId && req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData(result) {
            debug('send response : ');
            res.send({});
        }
        bookmark.changeToUnbookmark(req.session['loggedUser'].userId, movieId).then(sendData).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
function getAllWatched(req, res, next) {
    debug('GET /watched');
    if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData(result) {
            debug('send response : ');
            var output = [];
            _.forEach(result, function (r) {
                output.push(r.movieId);
            });
            res.send(output);
        }
        bookmark.findWatched(req.session['loggedUser'].userId).then(sendData).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
function addToWatched(req, res, next) {
    debug('POST /watched');
    var movieId = req.body.imdbId;
    if (movieId && req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData() {
            debug('send response : ');
            res.send({});
        }
        bookmark.changeToWatched(req.session['loggedUser'].userId, movieId).then(sendData).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
function getWatchedMovie(req, res, next) {
    debug('GET /watched/movie');
    if (req.session && req.session['loggedUser'] && req.session['loggedUser'].userId) {
        function sendData(result) {
            debug('send response : ');
            res.send(result);
        }
        function afterGetMovieIds(result) {
            var movieIds = [];
            _.forEach(result, function (bm) {
                movieIds.push(bm.movieId);
            });
            movie.findByImdbIDs(movieIds).then(sendData);
        }
        bookmark.findWatched(req.session['loggedUser'].userId).then(afterGetMovieIds).catch(next);
        ;
    }
    else {
        debug('not processed');
        res.send({});
    }
}
module.exports = moduleExport;

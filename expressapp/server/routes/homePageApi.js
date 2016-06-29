"use strict";
var movie = require('../facade/movie');
var debug = require('debug')('watchitlater:server:homePageApi');
var moduleExport = {
    getLatestBoxOffice: getLatestBoxOffice,
    getLatestTopMovie: getLatestTopMovie
};
function getLatestTopMovie(req, res, next) {
    debug('GET /getLatestTopMovie');
    var skip = req.query.skip ? req.query.skip : 0;
    var limit = req.query.limit ? req.query.limit : 5;
    debug('skip=' + skip + ', limit=' + limit);
    function sendData(result) {
        debug('sendata() result.length = ' + result.length);
        res.send(result);
    }
    debug('call movie.getLatestTopMovie()');
    movie.getLatestTopMovie(skip, limit)
        .then(sendData)
        .catch(next);
}
function getLatestBoxOffice(req, res, next) {
    debug('GET /getLatestBoxOffice');
    function sendData(result) {
        debug('sendata() result.legnth = ' + result.length);
        res.send(result);
    }
    debug('call movie.getLatestBoxOffice()');
    movie.getLatestBoxOffice()
        .then(sendData)
        .catch(next);
}
module.exports = moduleExport;

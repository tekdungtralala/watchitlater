"use strict";
var Q = require('q');
var AppConfig = require('./entity/AppConfig');
var debug = require('debug')('watchitlater:server:facade:appConfig');
var appModule = {
    updateLatestTopMovies: updateLatestTopMovies,
    updateLatestBoxOffice: updateLatestBoxOffice,
    getLatestBoxOffice: getLatestBoxOffice,
    getLatestTopMovie: getLatestTopMovie
};
var LATEST_BO_KEY = 'latest-box-office';
var LATEST_TM_KEY = 'latest-top-movies';
function updateLatestBoxOffice(movieIds) {
    debug('updateLatestBoxOffice() ' + movieIds);
    return findOneAndUpdate(LATEST_BO_KEY, movieIds);
}
function updateLatestTopMovies(movieIds) {
    debug('updateLatestTopMovies() ' + movieIds);
    return findOneAndUpdate(LATEST_TM_KEY, movieIds);
}
function getLatestBoxOffice() {
    debug('getLatestBoxOffice()');
    return getValue(LATEST_BO_KEY);
}
function getLatestTopMovie() {
    debug('getLatestTopMovie()');
    return getValue(LATEST_TM_KEY);
}
function getValue(key) {
    debug('getValue() ' + key);
    var deferred = Q.defer();
    var query = { key: key };
    AppConfig.findOne(query, function (err, doc) {
        debug('after findOne()');
        if (err) {
            debug('error ' + err);
            deferred.reject(err);
        }
        else {
            debug('resolve');
            deferred.resolve(doc.value);
        }
    });
    debug('return promise');
    return deferred.promise;
}
function findOneAndUpdate(key, value) {
    debug('findOneAndUpdate() ');
    var deferred = Q.defer();
    var query = { key: key };
    var opt = { upsert: true };
    var data = {
        key: key,
        value: value,
        updatedAt: new Date()
    };
    AppConfig.findOneAndUpdate(query, data, opt, function (err) {
        debug('after findOneAndUpdate() ');
        if (err) {
            debug('  error ' + err);
            deferred.reject(err);
        }
        else {
            debug('  saved ');
            deferred.resolve(true);
        }
    });
    debug('return promise');
    return deferred.promise;
}
module.exports = appModule;

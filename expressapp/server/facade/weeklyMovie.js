"use strict";
var Q = require('q');
var WeeklyMovie = require('./entity/WeeklyMovie');
var debug = require('debug')('watchitlater:server:facade:weeklyMovie');
var wmModule = {
    createOrUpdate: createOrUpdate,
    findWeeklyMovie: findWeeklyMovie
};
function findWeeklyMovie(fdow, ldow) {
    var deferred = Q.defer();
    setupDate(fdow);
    setupDate(ldow);
    debug('WeeklyMovie findWeeklyMovie() ' + fdow + ', ' + ldow);
    var query = {
        firstDayOfWeek: fdow,
        lastDayOfWeek: ldow
    };
    WeeklyMovie.findOne(query, {}, function (err, data) {
        debug('after findOne');
        if (err) {
            debug('error err=');
            debug(err);
            deferred.reject(err);
        }
        else {
            debug('success data=');
            debug(data);
            deferred.resolve(data);
        }
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
        var opt = { upsert: true };
        delete data['_id'];
        var newData = {
            firstDayOfWeek: data.firstDayOfWeek,
            lastDayOfWeek: data.lastDayOfWeek,
            movieIds: data.movieIds
        };
        WeeklyMovie.findOneAndUpdate(query, newData, opt, function (err, result) {
            debug('after findOneAndUpdate');
            if (err) {
                debug('error err=');
                debug(err);
                deferred.reject(err);
            }
            else {
                debug('success');
                deferred.resolve(data);
            }
        });
    }
    else {
        setTimeout(function () {
            deferred.reject(false);
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
module.exports = wmModule;

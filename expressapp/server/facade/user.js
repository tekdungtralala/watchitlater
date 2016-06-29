"use strict";
var Q = require('q');
var User = require('./entity/User');
var debug = require('debug')('watchitlater:server:user');
var userModule = {
    saveOrUpdate: saveOrUpdate
};
function saveOrUpdate(data) {
    debug('saveOrUpdate() ' + data.email);
    data.lastLogin = new Date();
    var deferred = Q.defer();
    var query = { email: data.email };
    var opt = { upsert: true };
    User.findOneAndUpdate(query, data, opt, function (err, data) {
        debug('after findOneAndUpdate');
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
    debug('return promise');
    return deferred.promise;
}
module.exports = userModule;

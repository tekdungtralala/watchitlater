/// <reference path="../../../typings/tsd.d.ts" />

import mongoose = require('mongoose');
import Q = require('q');

import appConfig = require('./appConfig');
import iUserModel = require('./model/iUserModel')
import User = require('./entity/User')

let debug: debug.IDebug = require('debug')('watchitlater:server:facade:user');

let userModule = {
	saveOrUpdate: saveOrUpdate
}

export = userModule

function saveOrUpdate(data: iUserModel): Q.Promise<iUserModel> {
	debug('saveOrUpdate() ' + data.email);
	data.lastLogin = new Date();
	var deferred = Q.defer<iUserModel>();
	var query = {email: data.email};
	var opt = {upsert: true};

	User.findOneAndUpdate(query, data, opt, function(err, data) {
		debug('after findOneAndUpdate')
		if (err) {
			debug('error err=');
			debug(err);
			deferred.reject(err);
		} else {
			debug('success data=');
			debug(data);
			deferred.resolve(data);
		}
	});

	debug('return promise')
	return deferred.promise;
}

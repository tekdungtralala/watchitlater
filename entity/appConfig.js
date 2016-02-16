var debug = require('debug')('watchitlater:server');
var Q = require('q');
var mongoose = require('mongoose');

var AppConfigSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Array
	},
	key: {
		type: String,
		trim: true
	},
	value: {
		type: Array,
		trim: true
	}
});
var AppConfig = mongoose.model('AppConfig', AppConfigSchema);
var LATEST_BO_KEY = 'latest-box-office';

var appModule = {
	updateLatestBoxOffice: updateLatestBoxOffice,
	getLatestBoxOffice: getLatestBoxOffice
};
module.exports = appModule;

function getLatestBoxOffice() {
	var deferred = Q.defer();
	var query = {key: LATEST_BO_KEY};
	AppConfig.findOne(query, function(err, doc) {
		if (err)
			debug('error ', err);
		else
			deferred.resolve(doc.value);
	});
	return deferred.promise;
}

function updateLatestBoxOffice(movieIds) {
	debug('AppConfig updateLatestBoxOffice() ', movieIds);
	
	var deferred = Q.defer();
	var query = {key: LATEST_BO_KEY};
	var opt = {upsert: true};

	var data = {
		key: KEY,
		value: movieIds
	};

	AppConfig.findOneAndUpdate(query, data, opt, function(err) {
		if (err)
			debug('error ', err);
		else
			debug('saved ');

		deferred.resolve();
	});
	return deferred.promise;
}
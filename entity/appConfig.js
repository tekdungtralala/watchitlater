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

var appModule = {
	updateLatestBoxOffice: updateLatestBoxOffice
};
module.exports = appModule;

function updateLatestBoxOffice(movieIds) {
	debug('AppConfig updateLatestBoxOffice() ', movieIds);
	var KEY = 'latest-box-office';
	var deferred = Q.defer();
	var query = {key: KEY};
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
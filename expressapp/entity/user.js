var debug = require('debug')('watchitlater:server');
var Q = require('q');
var mongoose = require('mongoose');
var appConfig = require('./appConfig');

var UserSchema = new mongoose.Schema({
	lastLogin: {
		type: Date,
		default: Date.now
	},
	email: {
		type: String,
		trim: true
	},
	socialNetwok: {
		id: {
			type: String,
			trim: true
		},
		fullName: {
			type: String,
			trim: true
		},
		imageUrl: {
			type: String,
			trim: true
		},
		type: {
			type: String,
			trim: true
		}
	}
});

var User = mongoose.model('User', UserSchema);

var userModule = {
	saveOrUpdate: saveOrUpdate
};
module.exports = userModule;

function saveOrUpdate(data) {
	debug('User saveOrUpdate() ' + data.email);
	data.lastLogin = new Date();
	var deferred = Q.defer();
	var query = {email: data.email};
	var opt = {upsert: true};
	User.findOneAndUpdate(query, data, opt, function(err, data) {
		if (err)
			debug('  error ', err);
		else
			debug('  saved ');
		deferred.resolve(data);
	});

	return deferred.promise;
}

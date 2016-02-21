var moment = require('moment');
var Q = require('q');
var http = require('http');

var appUtilModule = {
	getFirstLastDOW: getFirstLastDOW,
	fetchHtml: fetchHtml
};

module.exports = appUtilModule;

function fetchHtml(url) {
	var deferred = Q.defer();
	http.get(url, function(res) {
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			deferred.resolve(data);
		});
	});

	return deferred.promise;
}

function getFirstLastDOW(d) {
	var gDay = d.getDay();
	gDay = gDay < 5 ? (gDay + 7) : gDay;
	var fdRange = 5 - gDay;
	var fdow = moment(d).add(fdRange, 'day');

	var firstDayOfWeek = fdow._d;
	var lastDayOfWeek = moment(fdow._d).add(6, 'day')._d;

	return {
		fdow: firstDayOfWeek,
		ldow: lastDayOfWeek
	};
}

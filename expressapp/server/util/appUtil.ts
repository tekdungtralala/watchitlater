/// <reference path="../../../typings/tsd.d.ts" />

import Q = require('q');
import moment = require('moment');
import http = require('http');
import appInterface = require('appInterface');

let exportModule = {
	getFirstLastDOW: getFirstLastDOW,
	fetchHtml: fetchHtml,
	isValidateUrl: isValidateUrl
};

export = exportModule

function fetchHtml(url: string): Q.Promise<string> {
	var deferred: Q.Deferred<string> = Q.defer<string>();
	http.get(url, function(res) {
		var data: string = '';
		res.on('data', function(chunk: string) {
			data += chunk;
		});

		res.on('end', function() {
			deferred.resolve(data);
		});
	});

	return deferred.promise;
}

function getFirstLastDOW(d: Date): appInterface.FirstAndLastDOW {
	var gDay = d.getDay();
	gDay = gDay < 5 ? (gDay + 7) : gDay;
	var fdRange = 5 - gDay;
	var fdow: moment.Moment = moment(d).add(fdRange, 'day');

	var firstDayOfWeek = fdow.toDate();
	var lastDayOfWeek = moment(fdow.toDate()).add(6, 'day').toDate();

	let result: appInterface.FirstAndLastDOW = {
		fdow: firstDayOfWeek,
		ldow: lastDayOfWeek
	}

	return result;
}

function isValidateUrl(value: string) {
	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

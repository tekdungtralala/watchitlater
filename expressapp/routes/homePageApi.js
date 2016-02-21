var debug = require('debug')('watchitlater:server');
var movie = require('../entity/movie');

var moduleexports = {
	getLatestBoxOffice: getLatestBoxOffice,
	getLatestTopMovie: getLatestTopMovie
};

module.exports = moduleexports;

function getLatestTopMovie(req, res, next) {
	debug('/getLatestTopMovie');
	var skip = req.query.skip ? req.query.skip : 0;
	var limit = req.query.limit ? req.query.limit : 5;
	debug('  skip=' + skip + ', limit=' + limit);

	function sendData(result) {
		res.send(result);
	}

	movie.getLatestTopMovie(skip, limit).then(sendData);
}

function getLatestBoxOffice(req, res, next) {
	debug('/getLatestBoxOffice');
	function sendData(result) {
		res.send(result);
	}

	movie.getLatestBoxOffice().then(sendData);
}

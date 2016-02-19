var debug = require('debug')('watchitlater:server');
var express = require('express');
var router = express.Router();

var movie = require('../entity/movie');
var user = require('../entity/user');

/* GET home page. */
router.get('/getLatestBoxOffice', function(req, res, next) {
	movie
		.getLatestBoxOffice()
		.then(function(result) {
			res.send(result);
		});

});

router.get('/getLatestTopMovie', function(req, res, next) {
	debug('/getLatestTopMovie');
	var skip = req.query.skip ? req.query.skip : 0;
	var limit = req.query.limit ? req.query.limit : 5;
	debug('  skip=' + skip + ', limit=' + limit);
	movie
		.getLatestTopMovie(skip, limit)
		.then(function(result) {
			res.send(result);
		});

});

router.post('/signin', function(req, res, next) {
	var userData = req.body;
	user
		.saveOrUpdate(userData)
		.then(function(result) {
			res.send(result);
		});
});

module.exports = router;

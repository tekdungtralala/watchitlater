var debug = require('debug')('watchitlater:server');
var express = require('express');

var user = require('../entity/user');
var homePageApi = require('./homePageApi');
var weeklyMovieApi = require('./weeklyMovieApi');

var router = express.Router();

router.get('/getLatestBoxOffice', homePageApi.getLatestBoxOffice);
router.get('/getLatestTopMovie', homePageApi.getLatestTopMovie);
router.get('/weeklymovie', weeklyMovieApi.weeklymovieGet);
router.post('/weeklymovie', weeklyMovieApi.weeklymoviePost);

router.post('/signin', function(req, res, next) {
	var userData = req.body;

	function sendData(result) {
		res.send(result);
	}

	user.saveOrUpdate(userData).then(sendData);
});

module.exports = router;

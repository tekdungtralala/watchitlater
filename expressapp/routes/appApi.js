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
	movie
		.getLatestTopMovie()
		.then(function(result) {
			res.send(result);
		});

});

router.post('/signin', function(req, res, next) {
	var userData = req.body;
	user
		.saveOrUpdate(userData)
		.then(function(result) {
			res.send(result)
		})
});

module.exports = router;

var express = require('express');
var router = express.Router();

var movie = require('../entity/movie');

/* GET home page. */
router.get('/getLatestBoxOffice', function(req, res, next) {
	movie
		.getLatestBoxOffice()
		.then(function(result) {
			res.send(result);
		})
});

module.exports = router;

var debug = require('debug')('watchitlater:server');
var express = require('express');

var user = require('../entity/user');
var homePageApi = require('./homePageApi');
var weeklyMovieApi = require('./weeklyMovieApi');
var bookmarkApi = require('./bookmarkApi');

var router = express.Router();

router.get('/getLatestBoxOffice', homePageApi.getLatestBoxOffice);
router.get('/getLatestTopMovie', homePageApi.getLatestTopMovie);
router.get('/weeklymovie', weeklyMovieApi.weeklymovieGet);
router.post('/weeklymovie', weeklyMovieApi.weeklymoviePost);

router.get('/bookmarks', bookmarkApi.getAllBookmarked);
router.post('/bookmarks', bookmarkApi.addToBookmarked);
router.get('/bookmarks/movie', bookmarkApi.getBookmarkedMovie);

router.delete('/bookmarks', bookmarkApi.removeFromBookmark);

router.get('/watched', bookmarkApi.getAllWatched);
router.post('/watched', bookmarkApi.addToWatched);
router.get('/watched/movie', bookmarkApi.getWatchedMovie);

router.post('/signin', function(req, res, next) {
	var userData = req.body;

	function sendData(result) {
		var sess = req.session
		sess.loggedUser = {
			userId: result._id,
			email: result.email
		};
		res.send(result);
	}

	user.saveOrUpdate(userData).then(sendData);
});

module.exports = router;

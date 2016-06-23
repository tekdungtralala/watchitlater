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
router.post('/bookmarks', bookmarkApi.addToBookmark);
router.get('/bookmarks', bookmarkApi.getAllBookmarks);
router.delete('/bookmarks', bookmarkApi.removeFromBookmark);

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

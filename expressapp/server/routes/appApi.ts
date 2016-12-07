/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');

import user = require('../facade/user');
import homePageApi = require('./homePageApi');
import weeklyMovieApi = require('./weeklyMovieApi');
import bookmarkApi = require('./bookmarkApi');
import movieUtilApi = require('./movieUtilApi');

import iUserModel = require('../facade/model/iUserModel');

let debug: debug.IDebug = require('debug')('watchitlater:server:appApi');
let router = express.Router();

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

router.get('/moviesWithoutThumbnail', movieUtilApi.findAllMovieWithoutImageFile);

router.post('/signin', function(req, res, next) {
	debug('POST /signin');
	var userData = req.body;

	function sendData(result: iUserModel): void {
		var sess = req.session
		sess['loggedUser'] = {
			userId: result._id,
			email: result.email
		};
		res.send(result);
	}

	user.saveOrUpdate(userData).then(sendData).catch(next);
});

export = router;
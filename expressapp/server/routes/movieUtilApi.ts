/// <reference path="../../../typings/tsd.d.ts" />

import express = require('express');
import _ = require('lodash');
import fs = require('fs');

import movie = require('../facade/movie');
import iMovieModel = require('../facade/model/iMovieModel');

let debug: debug.IDebug = require('debug')('watchitlater:server:movieUtilApi');

let moduleExport = {
    findAllMovieWithoutImageFile: findAllMovieWithoutImageFile
}

function findAllMovieWithoutImageFile(req: express.Request, res: express.Response, next: express.NextFunction) {
    debug('findAllMovieWithoutImageFile()');
    movie.findAllMovie().then(afterFIndAllMovie);

    function afterFIndAllMovie(movies: iMovieModel[]) {
        let moviesWithoutRealImg: string[] = [];
        _.forEach(movies, function(m: iMovieModel) {
            try {
                fs.accessSync(generateRealPath(m.imdbID), fs.F_OK);
            } catch (err) {
                moviesWithoutRealImg.push(m.imdbID);
            }
        });

        findFailedSavedImage(moviesWithoutRealImg);
        function generateRealPath(imdbID: string) {
            return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
        }
    }

	function findFailedSavedImage(moviesWithoutRealImg: string[]) {
		var imgDir = 'expressapp/public/static-assets/imdb-img/';
		fs.readdir(imgDir, function(err: any, filesName: string[]) {
			_.forEach(filesName, function(f) {
				let fileSize: number = getFilesizeInBytes(imgDir + f);
				if (fileSize < 100) {
					moviesWithoutRealImg.push(f.split('.jpg')[0]);
				}
			});
			res.send(moviesWithoutRealImg);
		});

        function getFilesizeInBytes(filename: string): number {
            var stats = fs.statSync(filename)
            var fileSizeInBytes = stats["size"]
            return fileSizeInBytes;
        }
	}
}

export = moduleExport
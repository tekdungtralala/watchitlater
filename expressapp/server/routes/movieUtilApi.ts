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
        res.send(moviesWithoutRealImg);

        function generateRealPath(imdbID: string) {
            return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
        }
    }
}

export = moduleExport
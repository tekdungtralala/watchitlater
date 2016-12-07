"use strict";
var _ = require('lodash');
var fs = require('fs');
var movie = require('../facade/movie');
var debug = require('debug')('watchitlater:server:movieUtilApi');
var moduleExport = {
    findAllMovieWithoutImageFile: findAllMovieWithoutImageFile
};
function findAllMovieWithoutImageFile(req, res, next) {
    debug('findAllMovieWithoutImageFile()');
    movie.findAllMovie().then(afterFIndAllMovie);
    function afterFIndAllMovie(movies) {
        var moviesWithoutRealImg = [];
        _.forEach(movies, function (m) {
            try {
                fs.accessSync(generateRealPath(m.imdbID), fs.F_OK);
            }
            catch (err) {
                moviesWithoutRealImg.push(m.imdbID);
            }
        });
        res.send(moviesWithoutRealImg);
        function generateRealPath(imdbID) {
            return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
        }
    }
}
module.exports = moduleExport;

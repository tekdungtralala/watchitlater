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
        findFailedSavedImage(moviesWithoutRealImg);
        function generateRealPath(imdbID) {
            return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
        }
    }
    function findFailedSavedImage(moviesWithoutRealImg) {
        var imgDir = 'expressapp/public/static-assets/imdb-img/';
        fs.readdir(imgDir, function (err, filesName) {
            _.forEach(filesName, function (f) {
                var fileSize = getFilesizeInBytes(imgDir + f);
                if (fileSize < 100) {
                    moviesWithoutRealImg.push(f.split('.jpg')[0]);
                }
            });
            res.send(moviesWithoutRealImg);
        });
        function getFilesizeInBytes(filename) {
            var stats = fs.statSync(filename);
            var fileSizeInBytes = stats["size"];
            return fileSizeInBytes;
        }
    }
}
module.exports = moduleExport;

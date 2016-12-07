"use strict";
var Q = require('q');
var _ = require('lodash');
var request = require('request');
var fs = require('fs');
var movie = require('../facade/movie');
var appUtil = require('../util/appUtil');
var debug = require('debug')('watchitlater:server:movieUtil');
var movieUtilModule = {
    checkThumbnailMovies: checkThumbnailMovies2
};
function checkThumbnailMovies2() {
    var deferred = Q.defer();
    findAllMovieWithoutImageFile();
    function findAllMovieWithoutImageFile() {
        debug('findAllMovieWithoutImageFile()');
        movie.findAllMovie().then(afterFIndAllMovie);
        function afterFIndAllMovie(movies) {
            var moviesWithoutRealImg = [];
            _.forEach(movies, function (m) {
                try {
                    var path = generateRealPath(m.imdbID);
                    fs.accessSync(path, fs.F_OK);
                    m.isImageReady = true;
                    m.Poster = generateRelativePath(m.imdbID);
                    movie.updateMovie(m.imdbID, m);
                }
                catch (err) {
                    moviesWithoutRealImg.push(m.imdbID);
                }
            });
            debug('toal movies without image file : ' + moviesWithoutRealImg.length);
            deferred.resolve(true);
        }
    }
    function generateRelativePath(imdbID) {
        return 'static-assets/imdb-img/' + imdbID + '.jpg';
    }
    function generateRealPath(imdbID) {
        return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
    }
    return deferred.promise;
}
function checkThumbnailMovies() {
    debug('checkThumbnailMovies()');
    var deferred = Q.defer();
    var movies = [];
    var index = 0;
    findAllMovieWithoutImageFile();
    function findAllMovieWithoutImageFile() {
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
            debug('toal movies without image file : ' + moviesWithoutRealImg.length);
            findFailedSavedImage(moviesWithoutRealImg);
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
            debug('toal movies with failed image : ' + moviesWithoutRealImg.length);
            movie.findByImdbIDs(moviesWithoutRealImg).then(afterFindSelectedMovie);
        });
    }
    function afterFindSelectedMovie(movies) {
        debug('afterFindSelectedMovie movies.length = ' + movies.length);
        var currentIndex = 0;
        iterateMovie();
        function iterateMovie() {
            debug('iterateMovie() currentIndex = ' + currentIndex + ', total movie = ' + movies.length);
            if (currentIndex >= movies.length) {
                movie
                    .isHasMovieWOImage()
                    .then(afterCountMovie);
            }
            else {
                var m = movies[currentIndex];
                var url = 'http://www.omdbapi.com/?i=' + m.imdbID + '&plot=full&r=json';
                debug('omdbapi url = ' + url);
                appUtil.fetchHtml(url)
                    .then(processMovieData)
                    .then(updateMovie);
            }
        }
        function processMovieData(data) {
            debug('processMovieData()');
            return JSON.parse(data);
        }
        function updateMovie(m) {
            debug('updateMovie() m.imdbId=' + m.imdbID + ', m.Poster=' + m.Poster);
            m.isImageReady = false;
            m.PosterImdb = m.Poster;
            movie.updateMovie(m.imdbID, m).then(afterUpdatedMovie).catch(afterUpdatedMovie);
        }
        function afterUpdatedMovie() {
            debug('afterUpdatedMovie()');
            currentIndex++;
            iterateMovie();
        }
    }
    function afterCountMovie(result) {
        debug('afterCountMovie() result=' + result);
        if (result === 0)
            deferred.resolve(true);
        else
            findMoviesWOImage();
    }
    function findMoviesWOImage() {
        debug('findMovies()');
        movie
            .findMoviesWOImage()
            .then(afterFindMovies)
            .then(processFetchImage);
    }
    function afterFindMovies(result) {
        movies = result;
        debug('movies.length = ' + movies.length);
    }
    function processFetchImage() {
        if (index >= movies.length) {
            debug('finish checkThumbnailMovies()');
            deferred.resolve();
        }
        var movie = movies[index];
        debug('processFetchImage ' + movie.imdbID);
        debug(movie.PosterImdb);
        index++;
        if (movie.isImageReady === false)
            saveImage(movie.PosterImdb, movie.imdbID)
                .then(successSavedImage)
                .fail(processFetchImage);
        else
            processFetchImage();
    }
    function saveImage(url, imdbID) {
        var d = Q.defer();
        var imagePath = generateRealPath(imdbID);
        debug(imagePath);
        fs.access(imagePath, fs.F_OK, function (err) {
            if (!err) {
                debug('image exist, cancel download');
                d.resolve();
            }
            else {
                debug('start download');
                request.get({ url: url, encoding: 'binary' }, function (err, response, body) {
                    fs.writeFile(imagePath, body, 'binary', function (err) {
                        if (err)
                            d.reject(false);
                        else
                            d.resolve();
                    });
                });
            }
        });
        return d.promise;
    }
    function successSavedImage() {
        debug('  successSavedImage()');
        var currMovie = movies[index - 1];
        currMovie.isImageReady = true;
        currMovie.Poster = generateRelativePath(currMovie.imdbID);
        movie
            .createOrUpdate(currMovie)
            .then(processFetchImage);
    }
    function generateRealPath(imdbID) {
        return 'expressapp/public/static-assets/imdb-img/' + imdbID + '.jpg';
    }
    function generateRelativePath(imdbID) {
        return 'static-assets/imdb-img/' + imdbID + '.jpg';
    }
    function getFilesizeInBytes(filename) {
        var stats = fs.statSync(filename);
        var fileSizeInBytes = stats["size"];
        return fileSizeInBytes;
    }
    return deferred.promise;
}
module.exports = movieUtilModule;

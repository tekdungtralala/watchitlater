var debug = require('debug')('watchitlater:server');
var http = require('http');
var cheerio = require('cheerio');
var Q = require('q');

var movie = require('./movie');
var appConfig = require('./appConfig');

var initEntity = {
	doInitialize: doInitialize
};

module.exports = initEntity;

var movieIds = [];
var index = 0;

function doInitialize() {
	var url = "http://www.imdb.com/chart/";
	fetchHtml(url)
		.then(processData);
}

function fetchHtml(url, callback) {
	var deferred = Q.defer();
	http.get(url, function(res) {
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on("end", function() {
			deferred.resolve(data);
		});
	});
	return deferred.promise;
}

function processData(html) {
	var $ = cheerio.load(html);	
	$("#boxoffice table.chart.full-width tbody tr td.posterColumn").each(function(i, elm) {
		var $tr = cheerio.load($(this).html());
		var href = $tr("a").attr("href");
		var movieId = href.split("/title/")[1].split("?")[0];
		movieIds.push(movieId);
	});
	iterateMovieId();
}

function iterateMovieId() {
	if (index === movieIds.length) {
		appConfig.updateLatestBoxOffice(movieIds);
		return;
	}
	var movieId = movieIds[index];
	index++;
	var url = "http://www.omdbapi.com/?i=" + movieId + "&plot=full&r=json";
	fetchFromOmdbapi(url)
		.then(processDataFromApi);
}

function fetchFromOmdbapi(url) {
	return fetchHtml(url);
}

function processDataFromApi(data) {
	var obj = JSON.parse(data);

	movie.saveOrUpdate(obj)
		.then(iterateMovieId);
}
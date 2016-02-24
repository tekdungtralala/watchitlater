var debug = require('debug')('watchitlater:server');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'expressapp/views/handlebars'));
// jade template
//app.set('view engine', 'jade');
// handlebars template
app.engine('.html', exphbs({extname: '.html'}));
app.set('view engine', '.html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'expressapp/public')));

// Rest api
app.use('/api', require('./expressapp/routes/appApi'));

// angular page
app.get('/', renderIndexPage);
app.get('/home', renderIndexPage);
app.get('/top-movie', renderIndexPage);
app.get('/box-office', renderIndexPage);

// catch 404 and forward to error handler
app.use(handleError404);

function renderIndexPage(req, res) {
	var isProd = 'PROD' === process.env.PROFILE;
	var data = {
		isProd: isProd,
		angularModule: null,
		cssmin: null
	};

	function afterReadVendor(err, vendorModule) {
		if (err) {
			debug('error reading vendors.min.js');
			res.send('under service');
		} else {
			processResponse(vendorModule);
		}
	};

	function processResponse(vendorModule) {
		data.vendorModule = vendorModule;
		if (isProd) {
			var angularPath = 'expressapp/public/angular-app/app.min.js';
			fs.readFile(angularPath, {}, afterReadAngular);
		} else {
			res.render('index', data);
		}
	};

	function afterReadAngular(err, angularModule) {
		if (err) {
			debug('error reading angular.min.js');
			res.send('under service');
		} else {
			data.angularModule = angularModule;
			var cssminpath = 'expressapp/public/stylesheets/app.min.css';
			fs.readFile(cssminpath, {}, afterReadCss);
		}
	};

	function afterReadCss(err, cssmin) {
		if (err) {
			debug('error reading all.min.css');
			res.send('under service');
		} else {
			data.cssmin = cssmin;
			res.render('index', data);
		}
	}

	var vendorPath = 'expressapp/public/vendors.min.js';
	fs.readFile(vendorPath, {}, afterReadVendor);
};

function handleError404(res) {
	res.status(404).send('Sorry cant find that!');
};

module.exports = app;

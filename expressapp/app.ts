/// <reference path='../typings/tsd.d.ts' />

interface AppReq extends express.Request {
	test: string
	query: {
		viewAs: string
	}
}

interface RenderData {
	isProd: boolean,
	angularModule: string,
	cssmin: string,
	vendorModule?: string,
}

import express = require('express');
import path = require('path');
import exphbs = require('express-handlebars');
import logger = require('morgan');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import cookieSession = require('cookie-session');
import fs = require('fs');

let debug: debug.IDebug = require('debug')('watchitlater:app');
let app: express.Express = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/handlebars'));

// handlebars template
app.engine('.html', exphbs({extname: '.html'}));
app.set('view engine', '.html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cookie-session
app.use(cookieSession({
	name: 'session',
	keys: ['watchitlater-session']
}))

app.get('/', renderIndexPage);

// Rest api
import appApi = require('./server/routes/appApi');
app.use('/api', appApi);

// angular page
app.get('/', renderIndexPage);
app.get('/home', renderIndexPage);
app.get('/top-movie', renderIndexPage);
app.get('/box-office', renderIndexPage);
app.get('/my-account*', renderIndexPage);

function renderIndexPage(req: AppReq, res: express.Response, next: express.NextFunction): void {
	var indexView = 'index-ts';
	debug('renderIndexPage view = ' +  req.query.viewAs);
	if (req.query.viewAs === 'angularjs')
		indexView = 'index';
	else if (req.query.viewAs === 'typescript')
		indexView = 'index-ts';

	var isProd = 'PROD' === process.env.PROFILE;
	var data: RenderData = {
		isProd: isProd,
		angularModule: null,
		cssmin: null
	};

	function afterReadVendor(err: any, vendorModule: any) {
		if (err) {
			debug('error reading vendors.min.js');
			res.send('under service');
		} else {
			processResponse(vendorModule);
		}
	};

	function processResponse(vendorModule: string) {
		data.vendorModule = vendorModule;
		if (isProd) {
			var angularPath = 'expressapp/public/angular-app/app.min.js';
			fs.readFile(angularPath, {}, afterReadAngular);
		} else {
			res.render(indexView, data);
		}
	};

	function afterReadAngular(err: NodeJS.ErrnoException, angularModule: any) {
		if (err) {
			debug('error reading angular.min.js');
			res.send('under service');
		} else {
			data.angularModule = angularModule;
			var cssminpath = 'expressapp/public/stylesheets/app.min.css';
			fs.readFile(cssminpath, {}, afterReadCss);
		}
	};

	function afterReadCss(err: NodeJS.ErrnoException, cssmin: any) {
		if (err) {
			debug('error reading all.min.css');
			res.send('under service');
		} else {
			data.cssmin = cssmin;
			res.render(indexView, data);
		}
	}

	var vendorPath = 'expressapp/public/vendors.min.js';
	fs.readFile(vendorPath, {}, afterReadVendor);
}

export = app;
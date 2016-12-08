/// <reference path="../typings/tsd.d.ts" />

import http = require('http');
import mongoose = require('mongoose');
import app = require('./app');
import cron = require('cron');
import movieUtil = require('./server/util/movieUtil');

let debug: debug.IDebug = require('debug')('watchitlater:www');
import initEntity = require('./server/facade/initEntity');

mongoose.connect('mongodb://localhost/watchitlater');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	debug('connected to mongodb');
	startApp();
});

let port: number = null;
let server: http.Server = null;

function startApp(): void {
	debug('startApp() ' + new Date());
	/**
	 * Get port from environment and store in Express.
	 */
	port = normalizePort(process.env.PORT || '3000');
	app.set('port', port);

	/**
	 * Create HTTP server.
	 */
	server = http.createServer(app);

	/**
	 * Listen on provided port, on all network interfaces.
	 */
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	var doInitData = 'true' === process.env.DOINITDATA;
	var stillWorking = true;
	debug('doInitData start =' + doInitData);
	if (doInitData) {
		initEntity
			.doInitialize()
			.then(function() {
				debug('doInitData finish')
				stillWorking = false;
			});
	} else {
		stillWorking = false;
	}
	/*
		CronJob helper
		# ┌────────────── 0-59 second (optional)
		# │ ┌──────────── 0-59 minute
		# │ │ ┌────────── 0-23 hour
		# │ │ │ ┌──────── day of month
		# │ │ │ │ ┌────── 1-31 month
		# │ │ │ │ │ ┌──── 0-7 (0 or 7 are sunday) day of week
		# │ │ │ │ │ │
		# │ │ │ │ │ │
		# * * * * * *
	*/	

	try {
		new cron.CronJob('0 0 0 * * 0', function() {
			// run every sunday in hour 0, minute 0, second 0
			debug('CronJob do work initEntity.doInitialize()' + new Date());
			initEntity.doInitialize();
		}, null, true);

	} catch (ex) {
		debug("cron pattern not valid");
	}
	try {
		new cron.CronJob('30 30 0-23 * * *', function() {
			// run every hour, in minute 30, second 30
			debug("cronn job here "  + new Date() + ', stillWorking=' + stillWorking);
			if (!stillWorking) {
				stillWorking = true;
				debug('START update thumnail image' + new Date());
				stillWorking = false;
				movieUtil
					.checkThumbnailMovies()
					.then(movieUtil.checkRatingMovies)
					.then(function {
						debug('  FINISH check movies');
						stillWorking = false;		
					});
			}
		}, null, true);
	} catch (ex) {
		debug("error");
	}
}

function onError(error: NodeJS.ErrnoException) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			debug(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			debug(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

function normalizePort(val: any): number|any {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}
}
"use strict";
var http = require('http');
var mongoose = require('mongoose');
var app = require('./app');
var cron = require('cron');
var movieUtil = require('./server/util/movieUtil');
var debug = require('debug')('watchitlater:www');
var initEntity = require('./server/facade/initEntity');
mongoose.connect('mongodb://localhost/watchitlater');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    debug('connected to mongodb');
    startApp();
});
var port = null;
var server = null;
function startApp() {
    debug('startApp() ' + new Date());
    port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);
    server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    var doInitData = 'true' === process.env.DOINITDATA;
    var stillWorking = true;
    debug('doInitData start =' + doInitData);
    if (doInitData) {
        initEntity
            .doInitialize()
            .then(function () {
            debug('doInitData finish');
            stillWorking = false;
        });
    }
    else {
        stillWorking = false;
    }
    try {
        new cron.CronJob('0 0 0 * * 0', function () {
            debug('CronJob do work initEntity.doInitialize()' + new Date());
            initEntity.doInitialize();
        }, null, true);
    }
    catch (ex) {
        debug("cron pattern not valid");
    }
    try {
        new cron.CronJob('30 30 0-23 * * *', function () {
            debug("cronn job here " + new Date() + ', stillWorking=' + stillWorking);
            if (!stillWorking) {
                stillWorking = true;
                debug('START update thumnail image' + new Date());
                stillWorking = false;
                movieUtil
                    .checkThumbnailMovies()
                    .then(movieUtil.checkRatingMovies)
                    .then(function () {
                    debug('  FINISH check movies');
                    stillWorking = false;
                });
            }
        }, null, true);
    }
    catch (ex) {
        debug("error");
    }
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
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
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
}

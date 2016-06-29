"use strict";
var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var fs = require('fs');
var debug = require('debug')('watchitlater:app');
var app = express();
app.set('views', path.join(__dirname, 'views/handlebars'));
app.engine('.html', exphbs({ extname: '.html' }));
app.set('view engine', '.html');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'session',
    keys: ['watchitlater-session']
}));
app.get('/', renderIndexPage);
var appApi = require('./server/routes/appApi');
app.use('/api', appApi);
app.get('/', renderIndexPage);
app.get('/home', renderIndexPage);
app.get('/top-movie', renderIndexPage);
app.get('/box-office', renderIndexPage);
app.get('/my-account*', renderIndexPage);
function renderIndexPage(req, res, next) {
    var indexView = 'index-ts';
    debug('renderIndexPage view = ' + req.query.viewAs);
    if (req.query.viewAs === 'angularjs')
        indexView = 'index';
    else if (req.query.viewAs === 'typescript')
        indexView = 'index-ts';
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
        }
        else {
            processResponse(vendorModule);
        }
    }
    ;
    function processResponse(vendorModule) {
        data.vendorModule = vendorModule;
        if (isProd) {
            var angularPath = 'expressapp/public/angular-app/app.min.js';
            fs.readFile(angularPath, {}, afterReadAngular);
        }
        else {
            res.render(indexView, data);
        }
    }
    ;
    function afterReadAngular(err, angularModule) {
        if (err) {
            debug('error reading angular.min.js');
            res.send('under service');
        }
        else {
            data.angularModule = angularModule;
            var cssminpath = 'expressapp/public/stylesheets/app.min.css';
            fs.readFile(cssminpath, {}, afterReadCss);
        }
    }
    ;
    function afterReadCss(err, cssmin) {
        if (err) {
            debug('error reading all.min.css');
            res.send('under service');
        }
        else {
            data.cssmin = cssmin;
            res.render(indexView, data);
        }
    }
    var vendorPath = 'expressapp/public/vendors.min.js';
    fs.readFile(vendorPath, {}, afterReadVendor);
}
module.exports = app;

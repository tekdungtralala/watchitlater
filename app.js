var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

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

// catch 404 and forward to error handler
app.use('/api', require('./expressapp/routes/appApi'));
app.get('/', renderIndexPage);
app.get('/home', renderIndexPage);
app.use(handleError404);

function renderIndexPage(req, res) {
	res.render('index');
};

function handleError404() {
	res.status(404).send('Sorry cant find that!');
};

// error handlers
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,

			// will print stacktrace
			error: err

			// no stacktraces leaked to user
			// error: {}
		});
	});
}

module.exports = app;

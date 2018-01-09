var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');

var book = require('./routes/book');
var balances = require('./routes/balances');
var liveorders = require('./routes/liveorders');
var cancelorder = require('./routes/cancelorder');
var cancelallorders = require('./routes/cancelallorders');
var neworder = require('./routes/neworder');
var trades = require('./routes/trades');
var cron = require('./routes/cron');

var index = require('./routes/index');

cron.task.start();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  var credentials = auth(req);

  if (!credentials ||
    credentials.name !== 'ps' ||
    credentials.pass !== 'ps123') {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
    res.end('Access denied');
  } else {
    next();
  }
});

app.use('/book', book);
app.use('/balances', balances);
app.use('/liveorders', liveorders);
app.use('/cancelorder', cancelorder);
app.use('/cancelallorders', cancelallorders);
app.use('/neworder', neworder);
app.use('/trades', trades);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

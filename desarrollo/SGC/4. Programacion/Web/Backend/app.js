var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var root = require('./routes/root');
var parking = require('./routes/parking');
var company = require('./routes/company');
var employees = require('./routes/employee');
var users = require('./routes/user');
var parkingservices = require('./routes/parkingservice');

var app = express();

// view engine setup
app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(root);
app.use('/parking', parking);
app.use('/companies', company);
app.use('/employees', employees);
app.use('/users', users);
app.use('/parkingservices', parkingservices);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ error: '404 not found' });
});

module.exports = app;

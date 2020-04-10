/*
* John Lawless
* G00351835@gmit.ie
* 10/04/2020
*
* This code forms part of my Final Year Project
* for a BEng(Hons) Software and Electronic Engineering
*
* Vehicle Visage Verification (TripleV) is a fully networked,
* cloud-based fleet management system
* It includes:
*      1. A cloud based web application for managing the fleet
*      2. A cloud based database for storing all relative information
*      3. Encryption for all sensitive information on the database
*      4. Face recognition software held on a Raspberry Pi
*      5. A GUI held on the Pi.
* */



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

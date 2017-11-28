const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';

const connect = mongoose.connect(url, {
  useMongoClient: true
});
connect.then((db) => {
  console.log("Connected to Mongo DB server");
}, (err) => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser('IT_IS_FUN_TO_LEARN'));

function auth(req, res, next) {
  console.log(req.signedCookies);
  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    if (username === 'kundan' && password === 'password') {
      res.cookie('user', username, {
        signed: true
      });
      next();
    } else {
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.signedCookies.user === 'kundan') {
      next();
    } else {
      var err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
//Routing all /dishes to dishRouter
app.use('/dishes', dishRouter);
//Routing all /promotions to promoRouter
app.use('/promotions', promoRouter);
//Routing all /leadership to leaderRouter
app.use('/leaders', leaderRouter);

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
  res.render('error');
});

module.exports = app;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


var Dishes = require('./models/dishes');

var url = config.mongoUrl;

var connect = mongoose.connect(url, {
  useMongoClient: true
});
connect.then((db) => {
  console.log("Connected to Mongo DB server");
}, (err) => {
  console.log(err);
});

var app = express();
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect('https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

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
//app.use(cookieParser('IT_IS_FUN_TO_LEARN'));

// app.use(session({
//   name: 'session-id',
//   secret: 'IT_IS_FUN_TO_LEARN',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());

// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     next(err);
//   } else {
//     next();
//   }
// }

app.use('/', index);
app.use('/users', users);

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


//Routing all /dishes to dishRouter
app.use('/dishes', dishRouter);
//Routing all /promotions to promoRouter
app.use('/promotions', promoRouter);
//Routing all /leadership to leaderRouter
app.use('/leaders', leaderRouter);
//Configure the upload router
app.use('/imageUpload', uploadRouter);
//Routing the favourites route
app.use('/favorites', favoriteRouter);

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
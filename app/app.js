environment = process.env.NODE_ENV || 'development';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/makersbnb' + environment);

var routes = require('./routes/index');
var users = require('./routes/users');
var spaces = require('./routes/spaces');

var app = express();

var sessionOptions = {
  secret: "secret",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    url:"mongodb://localhost:27017/makersbnbdevelopment"
  })
};

app.use(session(sessionOptions));

app.get("/", function(req, res){
  if ( !req.session.views){
    req.session.views = 1;
  }else{
    req.session.views += 1;
  }

  res.json({
    "status" : "ok",
    "frequency" : req.session.views
  });
});

app.listen(3300, function (){
  console.log("Server started at: http://localhost:3300");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/spaces', spaces);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

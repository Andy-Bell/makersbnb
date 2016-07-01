environment = process.env.NODE_ENV || 'development';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email = require('emailjs');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/makersbnb' + environment);

var routes = require('./routes/index');
var users = require('./routes/users');
var spaces = require('./routes/spaces');

var app = express();

app.use(session({
  secret: 'secret',
  resave: false,
  saveUnitialized: true,
  // store: new MongoStore({ db: process.env.MONGODB_DATABASE || 'passwordless-simple-mail',
  //                         host: process.env.MONGODB_HOST || '127.0.0.1',
  //                         port: process.env.MONGODB_PORT || 27017,
  //                         username: process.env.MONGODB_USERNAME || '',
  //                         password: process.env.MONGODB_PASSWORD || ''
  // })
}));

var yourEmail = 'makersbnb2016@gmail.com';
var yourPwd = 'makersbnb123';
var yourSmtp = 'smtp.gmail.com';

var smtpServer = email.server.connect({
  user: yourEmail,
  password: yourPwd,
  host: yourSmtp,
  ssl: true
});

var pathToMongoDb = 'mongodb://localhost/passwordless-simple-mail';
passwordless.init(new MongoStore(pathToMongoDb));

passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = 'localhost:3000';
        smtpServer.send({
            text:    'Hello!\nAccess your account here: http://'
            + host + '?token=' + tokenToSend + '&uid='
            + encodeURIComponent(uidToSend),
            from:    yourEmail,
            to:      recipient,
            subject: 'Token for ' + host
        }, function(err, message) {
            if(err) {
                console.log(err);
            }
            callback(err);
        });
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

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

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

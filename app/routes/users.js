environment = process.env.NODE_ENV || 'development';
var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/makersbnb' + environment);
var users  = db.get('users');
var passwordless = require('passwordless');

users.index('username', {unique: true});

/* GET users listing. */
router.get('/', function(req, res, next) {
  var data = users.find({});
  data.on('success', function(docs){
    res.render('users/index', {
      title: 'Welcome',
      data: docs.pop()
      });
  });
});

router.get('/new', function(req, res) {
  res.render('users/new', { title: 'Sign Up' });
});

router.post('/new', function(req, res) {
  var user = {
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email
  };
  var insert = users.insert(user);
  insert.on('success', function(){
    res.redirect('/users');
  });
  insert.on('error', function(){
    console.log("invalid space");
    res.redirect('/users/new');
  });

});

/* GET login screen. */
router.get('/login', function(req, res) {
   res.render('login');
});

/* POST login details. */
router.post('/sendtoken',
    passwordless.requestToken(
        // Turn the email address into an user ID
        function(user, delivery, callback, req) {
            // usually you would want something like:
          callback(null, user);
        }),
    function(req, res) {
       // success!
          res.render('sent');
});


module.exports = router;

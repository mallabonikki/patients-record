var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var provider = require('../provider')

// var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title': 'LogIn'
  })
});

router.post('/register', function(req, res, next) {
  //Get the form values
  var name = req.body.name
  var email = req.body.email
  var username = req.body.username
  var password = req.body.password
  var password2 = req.body.password2

  if (req.files.profileimage) {
    console.log('uploading file...')

    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName = req.files.profileImage.name
    var profileImageMime = req.files.profileImage.mimetype
    var profileImagePath = req.files.profileImage.path
    var profileImageExt = req.files.profileImage.extension
    var profileImageSize = req.files.profileImage.size
  } else {
    //set the default image
    var profileImageName = 'noimage.png'
  }

  //Validation
  req.checkBody('name', 'Name filed is required').notEmpty()
  req.checkBody('email', 'Email filed is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username filed is required').notEmpty()
  req.checkBody('password', 'password filed is required').notEmpty()
  req.checkBody('password2', 'Password do not match').equals(req.body.password)

  var errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      errors: errors, 
      name: name,
      email: email,
      password: password,
      password2: password2
    });
  } 
  else {

    bcrypt.hash(password, 10, function(err, hash) {
      if (err) throw err
      password = hash

      provider.addUser(name, email, password, profileImageName)
        .then((err) => {
          req.flash('success', 'You are now registered and may log in.')  
        })
        .catch(() => {
          req.flash('danger', 'Error creating user in the database');
          return 
        })
    });


    res.location('/')
    res.redirect('/')
  }

});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username + password)
  })
);

router.post(
  '/login', 
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username password' }),
  function(req, res) {
    console.log('Authentication successful')
    req.flash('success', 'You are logged in')
    res.redirect('/')
  }
);

module.exports = router;

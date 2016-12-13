var express = require('express');
var router = express.Router();

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
    // var newUser = new User({
    //   name: name,
    //   email: email,
    //   password: password,
    //   profileimage: profileImageName
    // });

    // User.createUser(newUser, function(err, user) {
    //   if (err) throw err
    //   console.log(user)
    // });

    provider.db.addUser(name, email, password, profileImageName)
      .then((err) => {
        req.flash('success', 'You are now registered and may log in.')  
      })
      .catch(() => {
        req.flash('danger', 'Error creating user in the database');
        return 
      })
      .finally(provider.db.end())

    res.location('/')
    res.redirect('/')
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const passport = require('passport');

//---------Redirect to Campgrounds Page----------
router.get('/', (req, res) => {
  res.render('landing');
});


//---------Get Register Page---------------------
router.get('/register', (req, res) => {
  res.render('register');
});

//---------Get login Page------------------------
router.get('/login', (req, res) => {
  res.render('login');
});

//---------Register new User into Database-------------
router.post('/register', (req, res) => {
  let newUser = new Users({username: req.body.username});

  Users.register(newUser, req.body.password)
      .then((user) => {
        passport.authenticate('local')(req, res, () => {
          req.flash('success', 'Welcome to Yelp camp ' + user.username.toUpperCase());
          res.redirect('/campgrounds')});
      })
      .catch((err) => {
        req.flash('error', err.message)
        res.redirect('/register');
      });
});

//-----------authenticate User----------------------
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureredirect: '/login'
}));

//-----------Log Out the user from site---------------
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out.');
  res.redirect('/campgrounds');
});

module.exports = router;

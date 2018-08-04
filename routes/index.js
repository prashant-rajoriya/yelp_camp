const express = require('express');
const router = express.Router();
const Users = require('../models/user');
const passport = require('passport');
const nodemailer = require('nodemailer');
const transporter = require('../middleware/nodemailer')
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

//-----------Get Contact Form--------------------------
router.get('/contact', (req, res) =>{
  res.render('contact');
});

//-----------Sent Email Using nodemailer---------------
router.post('/contact', (req, res) => {

    let output = `
      <p> ${req.body.contact.name} send you a mail</p>
      <h3>Message to be recieved</h3>
      <ul>
        <li> Name : ${req.body.contact.name}</li>
        <li> Email : ${req.body.contact.email}</li>
        <li> Phone : ${req.body.contact.phone}</li>
        <li> Company : ${req.body.contact.company}</li>
      </ul>
      <p>${req.body.contact.message}</p>
    `;

    const mailOptions = {
      from : 'opfhz3ehocdjxj3o@ethereal.email',
      to: 'prashant.ulo@gmail.com',
      subject: 'Node mailer test mail',
      html: output
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        console.error(err);
      }
      res.redirect('/');
    });
});

module.exports = router;

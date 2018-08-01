const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');

const app = express();

//----------------Models---------------------------
const Comments = require('./models/comment.js');
const Campgrounds = require('./models/campground.js');
const User = require('./models/user.js');

//---------------Get Routes------------------------
const indexRoutes = require('./routes/index');
const campgroundRoutes = require('./routes/campground');
const commentRoutes = require('./routes/comment');

//-----------Connect MongoDB----------------------
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yealp_camp_es8')
      .then(() => console.log('Database Connected'))
      .catch((err) => console.error(err));

//----------App configure-------------------------
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static( __dirname+'/public'));
app.use(methodOverride('_method'));
app.use(flash());

//-----------Authorization Configure---------------
app.use(require('express-session')({
  secret: "You are reading too much web-novels",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//--------Middleware insertion For all routes--------------------
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//---------------Configure Routes-----------------------
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//----------------Server Start--------------------
app.listen(3000, (err, res) => {
  if(!err){
    console.log('Server Started');
  }
  else{
    console.error(err);
  }
});

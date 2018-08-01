const express = require('express');
const router = express.Router();
const Campgrounds = require('../models/campground');
const Middleware = require('../middleware');

//-------------GET MAIN PAGE ---------------------
router.get('/', (req, res) => {
  Campgrounds.find({})
      .then((data) => res.render('campground/index', {campgrounds: data}))
      .catch((err) => req.flash('error', err.message));
});

//----------Get Add campground PAGE-----------
router.get('/new', Middleware.isLoggedIn, (req, res) => {
  res.render('campground/new');
});

//-----------Get the Selected campground Page-----------
router.get('/:id', (req, res) => {
  Campgrounds.findOne({_id: req.params.id})
      .populate('comments')
      .exec()
      .then((campground) => res.render('campground/show', {campground: campground}))
      .catch((err) => req.flash('error', err.message));
});

//---------Add new campground---------------------
router.post('/', Middleware.isLoggedIn, (req, res) => {
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }

  Campgrounds.create(req.body.campground)
      .then((campground) => {
        req.flash('success', 'New Campground Has been added to out Site.');
        res.redirect('/campgrounds')})
      .catch((err) => req.flash('error', err.message));
});

//---------Edit Request Page-------------------
router.get('/:id/edit', Middleware.checkCampgroundOwernship, (req, res) => {
  Campgrounds.findOne({_id: req.params.id})
      .then(campground => res.render('campground/edit', {campground: campground}))
      .catch(err => req.flash('error', err.message));
});


//---------Edit Campground---------------------
router.put('/:id', Middleware.checkCampgroundOwernship, (req, res) => {
  Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground)
      .then( campground => {
        req.flash('success', 'You have successfuly edited your campground.');
        res.redirect('/campgrounds/'+req.params.id)})
      .catch(err => req.flash('error', err.message));
});

//---------Delete Campground-------------------
router.delete('/:id', Middleware.checkCampgroundOwernship, (req, res) => {
  Campgrounds.findByIdAndRemove(req.params.id)
      .then( () => {
        req.flash('success', 'You have successfuly deleted your campground.');
        res.redirect('/campgrounds')
      } )
      .catch(err => req.flash('error', err.message));
});

module.exports = router;

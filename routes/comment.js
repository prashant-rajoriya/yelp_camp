const express = require('express');
const router = express.Router({mergeParams: true});
const Comments = require('../models/comment');
const Campgrounds = require('../models/campground');
const Middleware = require('../middleware');

//--------------Get Add Comment Form---------
router.get('/new', Middleware.isLoggedIn, (req,res) => {
  res.render('comment/new', {id: req.params.id});
});

//-------------Add Comment To Campground------------
router.post('/', Middleware.isLoggedIn, (req,res) => {
    createComment(req.params.id, req.body.comment, req.user);
    req.flash('success', 'Comment Have been added to our Site.');
    res.redirect('/campgrounds/'+req.params.id);
})

//----------Function To create And Save Comment--------
async function createComment(id, body, user) {
  try {
      body.author = {
        id: user._id,
        username: user.username
      };
      let comment = await Comments.create(body);
      let campground = await Campgrounds.findOne({_id: id});
      campground.comments.push(comment);
      campground.save();

      return campground;
  } catch (e) {
      req.flash('error', e.message);
  }
}

//---------Get Edit Comment Form--------------------------
router.get('/:comment_id/edit', Middleware.checkCommentOwernship, (req, res) => {
  Comments.findOne({_id: req.params.comment_id})
      .then(comment => res.render('comment/edit',{campground_id: req.params.id, comment: comment}))
      .catch(err => req.flash('error', err.message));
});

//---------Register The comment of user into the User Database----------------
router.put('/:comment_id', Middleware.checkCommentOwernship, (req, res) => {
  Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment)
      .then(comment => {
        req.flash('success', 'Comment Have been Edited to our Site.');
        res.redirect('/campgrounds/'+req.params.id)})
      .catch(err => req.flash('error', err.message));
});

//---------Delete the Comment of user Signed In-------------------------------
router.delete('/:comment_id', Middleware.checkCommentOwernship, (req, res) => {
  Comments.findByIdAndRemove(req.params.comment_id)
      .then(() => {
        req.flash('success', 'Comment Have been deleted');
        res.redirect('back')})
      .catch(err => req.flash('error', err.message));
});

module.exports = router;

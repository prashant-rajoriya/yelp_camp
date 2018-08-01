const Campgrounds = require('../models/campground');
const Comments = require('../models/comment');

var Middleware = {};

//---------Middleware check current user is equals to who created it------------
Middleware.checkCampgroundOwernship = (req, res, next) => {
  if(req.isAuthenticated()){
    Campgrounds.findOne({_id: req.params.id})
        .then(campground => {
          if (campground.author.id.equals(req.user._id)) {
            next()
          } else {
            req.flash('error', 'You do not have permissions for that.');
            res.redirect('back');
          }
        })
        .catch(err => req.flash('error', err.message));
  }else{
    req.flash('error', 'You need to be Logged in for to do that');
    res.redirect('/login');
  }
}

//---------Middleware Check if Comment is of same Logged In User--------------
Middleware.checkCommentOwernship = (req, res, next) => {
  if(req.isAuthenticated()){
    Comments.findById(req.params.comment_id)
        .then(comment => {
          if (comment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash('error', 'You do not have permissions for that.');
            res.redirect('back');
          }
        })
        .catch(err => req.flash('error', err.message));
  }else{
    req.flash('error', 'You need to be Logged in for to do that');
    res.redirect('/login');
  }
}

//---------Middleware Check if user is Logged In----------
Middleware.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You need to be Logged in for to do that');
  res.redirect('/login');
}

module.exports = Middleware;

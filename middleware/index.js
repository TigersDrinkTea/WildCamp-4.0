
var Campground = require('../models/campground');
var Comment = require('../models/comment');
//ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.authorizeUser = function(req,res,next){

        if (req.isAuthenticated()) {
    
            Campground.findById(req.params.id, function (err, foundCampground) {
                if (err) {
                    res.redirect('/campgrounds');
                } else {
                    //DOES USER OWN CAMPGROUND?
                    if (foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error', 'Please Log In!')
                        res.redirect('/campgrounds');
                    }
    
                }
            });
        } else {
            res.redirect('/campgrounds');
        }
    }

middlewareObj.authorizeComment = function (req,res,next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                //DOES USER OWN CAMPGROUND?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Please Log In!')
                    res.redirect('/campgrounds');
                }

            }
        });
    } else {
        res.redirect('back');
    }
  }


  // This is middleware in the /secret route and is added in the middle of the oute and is run before anything and checks authentiocation, if you are logged in the it runs next() which is everything after isLoggedIn in the secret route. stops the page rendering if you arent logged in.
  middlewareObj.isLoggedIn = function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'Please Log In!')
        res.redirect('/login');
     }
    
     middlewareObj.isAdmin = function(req, res, next) {
        if(req.user.isAdmin) {
          next();
        } else {
          req.flash('success', 'Hi There!\r\nThanks for looking at my portfolio.\r\nThis is a read only version of this site to prevent the upload of unverified content . For an interactive demo of the full site contact me for an admin key!');
          res.redirect('back');
        }
      },
  
    //  middlewareObj.isSafe =  function (req, res, next) {
    //     if(req.body.newCampImage.match(/^https:\/\/nature\.unsplash\.com\/.*/)) {
    //       next();
    //     }else {
    //       req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
    //       res.redirect('back');
    //     }
    //   }
    
module.exports = middlewareObj




const express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/campground');
var Comment = require('../models/comment')
var middleware = require('../middleware')

//==============
//COMMENTS ROUTES
//=============

//Comments- NEW
router.get('/new',middleware.isLoggedIn, middleware.isAdmin, function (req,res) {
    // find campground by id
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err);
            
        }else{
            res.render('comments/new', {campground:campground})
        }
      })
  });

//COMMENTS - CREATE
router.post('/',middleware.isLoggedIn, middleware.isAdmin,function (req,res) {
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err);
            res.redirect('/campgrounds')
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                    
                }else{
                    //Add username and ID to comment
                    // req.user.username = username to be added automatically to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
      })
  });

  // EDIT COMMENTS //
  router.get('/:comment_id/edit', middleware.authorizeComment, middleware.isAdmin, function (req,res) {
      Comment.findById(req.params.comment_id, function (err,foundComment) {
        if(err){
            res.redirect('back')
        }else{
            res.render('comments/edit', {campground_id:req.params.id, comment:foundComment});
        }
        });
         
    });

// COMMENT UPDATE //
router.put('/:comment_id', middleware.authorizeComment, middleware.isAdmin, function (req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComments) { 
        if(err){
            res.redirect('back')
        }else{
           res.redirect('/campgrounds/' + req.params.id) 
        }
     })
  });

  //COMMENTS DESTROY//

  router.delete('/:comment_id', middleware.authorizeComment, middleware.isAdmin, function(req,res){
      //find by id and remove
      Comment.findByIdAndRemove(req.params.comment_id, function (err) {
          if(err){
              res.redirect('back')
          }else{
              req.flash('success', 'Comment Deleted')
              res.redirect('/campgrounds/' + req.params.id)
          }
        } )
  })




  //MIDDLEWARE



  module.exports = router;
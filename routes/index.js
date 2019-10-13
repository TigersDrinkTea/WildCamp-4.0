
//========================
//RANDOM ROUTES . . .
//========================
const express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user')
var middleware = require('../middleware')


router.get('/', function (req, res) {
    res.render('landing');
});

router.get('/intro', function (req,res) {  
res.render('intro')
});

router.get('/administrator', middleware.isLoggedIn, function (req, res) {
    res.render('administrator')
})


//======================
//AUTHENTICATION - ROUTES
//=======================


//show sign-up form NEW
router.get('/register', function (req, res) {
    res.render('register')
})

//user sign up logic CREATE
router.post('/register', function (req, res) {
   
    var newUser = new User({username: req.body.username});
    if(req.body.username === 'adminadmin') {newUser.isAdmin = true };

        User.register(newUser, req.body.password,  function (err, user) {
        if (err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success','Welcome to Wild Camp ' + user.username);
            res.redirect('/campgrounds');
        })
    });
})
// the pasport.authenticate is used in the callback feature not in the actual route


//=======================
//LOGIN - ROUTES
//=======================

//RENDER THE LOGIN FORM - NEW
router.get('/login', function (req,res) {
    res.render('login');
  });

  //LOGIN - LOGIC AND AUTHENTICATION, CHECKING YOU HAVE PREVIOUSLY SIGNED UP AND HAVE A VALID LOGIN
router.post('/login',  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}) ,function (req,res) {
  })
  // Here passport.authenticate has been used not in the callabck but in the router.post itself. This is called middleware. 


//=======================
//LOG OUT - ROUTES
//=======================
router.get('/logout', function (req,res) {
    req.logout();
    req.flash('success', 'Successfully logged out')
    res.redirect('/campgrounds')
  })



  
  module.exports = router;
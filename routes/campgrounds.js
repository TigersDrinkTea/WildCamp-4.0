//========================
//RESTFUL ROUTES
//========================

const express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware')

// INDEX--THIS ROUTE DISPLAYS ALL THE CAMPGROUNDS//
router.get('/', function (req, res) {

    Campground.find({}, function (err, allgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/campgroundsIndex', {
                campground: allgrounds,

            })
        }
    });
});

//NEW-- SHOW FORM TO CREATE NEW//
router.get('/new', middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
    // This Route gets you the newcampground form, so you can input data in to the form to make new campground.
    // At the end the form submits a post request to (POST method) and the action direct to /campgrounds 
    res.render('campgrounds/newcampground')
})

//POST FORM TO CREATE NEW CAMP AND SAVE TO DB//
router.post('/', middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
    //get data from the form and add it to campgrounds array with body-parser.
    // now we have all the data and can pass it from the input in to the array.
    var name = req.body.newCampName;
    var image = req.body.newCampImage;
    var desc = req.body.newCampDescription;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //make a new JS Object for the new campgrounds so they can be added to the array

    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    }
    console.log(req.user);
    Campground.create(newCampground, function (err) {
        if (err) {
            
            console.log(err);
        } else {
            req.flash('success', 'Campground Successfully  Added!')
            //redirect back to campgrounds page so you can see the newly added campground
            res.redirect('/campgrounds')
        }
    });
});

//SHOW- SHOWS MORE INFO ON ONE SITE SPECIFICALLY (ID)
router.get('/:id', function (req, res) {
    //Find the campground with the routerropriate id from the request paramaters.
    Campground.findById(req.params.id).populate('comments').exec(function (err, specificCamp) {
        if (err) {
                       console.log(err);
        } else {
            res.render('campgrounds/show', {
                campground: specificCamp
            })
        }
    });
});

//EDIT CAMPSITES//
router.get('/:id/edit', middleware.authorizeUser, middleware.isAdmin, function (req, res) {
    //IS USER LOGGED IN?
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', {
            campground: foundCampground
        });

    });

});

//UPDATE CAMPSITES//
router.put('/:id', middleware.authorizeUser, middleware.isAdmin, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if (err) {
            req.flash('error','You Do Not Have Permission To Do That')
            res.redirect('/campgrounds')
        } else {
            req.flash('success', 'Campground Successfully Edited!')
            res.redirect('/campgrounds/' + req.params.id)
        }
    });

})

// DESTROY CAMPGROUND
router.delete('/:id', middleware.authorizeUser, middleware.isAdmin, function (req, res) {
    Campground.findOneAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect('/campgrounds')
        } else {
            req.flash('success', 'Campground Deleted')
            res.redirect('/campgrounds')
        }
    })
})



//MIDDLEWARE



module.exports = router;
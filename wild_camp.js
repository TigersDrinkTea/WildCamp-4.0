require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');


const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose')

const User = require('./models/user');
const Campground = require('./models/campground');
const seedDB = require('./seeds');
const Comment = require('./models/comment');


const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const inedxRoutes = require('./routes/index');


//========================
//USED TO STOP BACK BUTTON AFTER LOG OUT
//========================
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

//========================
////CREATE NEW DB IN MONGO
//========================

//'mongodb://localhost/testDB'
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());

//========================
//SEED DATABASE
//========================
seedDB();


//========================
//PASSPORT CONFIGURATION
//========================

app.use(require('express-session')({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(inedxRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);




app.listen(process.env.PORT || 3000)
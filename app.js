var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var User = require("./models/user");
var Comment = require("./models/comment");
var flash = require("connect-flash");


var seedDB = require("./seeds");
var passport = require("passport");
var methodOverride = require("method-override");
var LocalStrategy = require("passport-local");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// seed the database
// seedDB();

mongoose.connect(process.env.DATABASEURL);

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again blabla",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//=============================================================================
//Starts the server

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started!");
});

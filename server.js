"use Strict";
// Set up =====================================================================================================================
var express = require("express");
var cookieParser = require('cookie-parser');
var app = express();
var session = require('express-session');
var port = process.env.PORT || 8080;
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird"); // NOTE: bluebird's promise performance * 4
//Configuration server requirements
var morgan = require('morgan');
var bodyParser = require('body-parser');
var configDB = require('./config/database');

require('./config/passport')(app);
require("ejs");
//Require ROUTES
var indexRoute = require("./app/models/routes/indexRoutes");
var usersRoute = require("./app/models/routes/userRoutes");
var assignmentRoute = require("./app/models/routes/assignmentRoutes");
// Configuration =================================================================================================================
mongoose.connect(configDB.url); //connect DB
app.use(morgan('dev')); // log every request to the console
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(session({ 
    name: "Cookie_compact",
    secret: 'nosecretguys',
    resave: true,
    saveUninitialized: true
    //store: sessionStore, 
    //connect-mongo session store,
    //proxy: true
 }));
app.use(express.static(__dirname + '/public')); //CSS & JS files front-end
app.set('view engine', 'ejs');// set the view engine to ejs
// ROUTES setup ====================================================================================================================
app.use('/users',usersRoute);
app.use('/assignments', assignmentRoute);
app.use('/', indexRoute);

//launch ===========================================================================================================================
app.listen(port);
console.log('server running on port: ' + port);

/**
 * DROP DB 
 * use [database];
 * db.dropDatabase();
 * */
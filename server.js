// Set up =====================================================================================================================
let express = require("express");
let cookieParser = require('cookie-parser');
let app = express();
let session = require('express-session');
let port = process.env.PORT || 8080;
let mongoose = require("mongoose");
mongoose.Promise = require("bluebird"); // NOTE: bluebird's promise performance * 4
//Configuration server requirements
let morgan = require('morgan');
var multer  = require('multer');
let bodyParser = require('body-parser');
let configDB = require('./config/config');
require("ejs");
//Require ROUTES
let api = require("./app/routes/api");
//let index = require("./app/models/routes/indexRoutes");
// Configuration =================================================================================================================
mongoose.connect(configDB.urlDatabase) //connect DB
.then(() => { 
      console.log("Db connected!"); 
})
.catch(err => { 
      console.log(err);
});
app.use(morgan('dev')); // log every request to the console
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }) );

// app.oauth = oauthserver({
//   model: {}, // See below for specification 
//   grants: ['password'],
//   debug: true
// });
 
// app.all('/oauth/token', app.oauth.grant());
// app.get('/', app.oauth.authorise(), function (req, res) {
//   res.send('Secret area');
// });
// app.use(app.oauth.errorHandler());

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
app.use('/api', api);
//app.use('/', index);
//launch ===========================================================================================================================
app.listen(port);
console.log('server running on port: ' + port);

/**
 * DROP DB 
 * use [database];
 * db.dropDatabase();
 * */
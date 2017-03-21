"use Strict";

var User   = require('../user'); // get mongoose model
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var jwt = require('../../../services/jwt');
var mail = require('../lib/mail');
var mailConfig = require('../../../config/mail');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");

exports.userMethods = {
	/**
	 * Save user
	 * params(String, String, String, String, Boolean)
	 */
    create: function(firstname, lastname, email, password, admin){
		console.log("create");
		return new Promise((resolve, reject) => {
			//create new user
			var newUser = new User({ 
						name: 
						{
							first: firstname,
							last: lastname
						},
						email: email,
						password: password,
						admin: admin
						// users: Array
						// firstLogin: Boolean,
			});
			//For token
			/*var payload = {
				iss: email,
				sub: newUser._id
			}
			var token = jwt.encode(payload, "secretkey");*/

			//save user
			newUser.save({}, (err, user) => {
				if(err){
					console.log(err);
					return reject(err);
				}
				// console.log("heurhei heromiq oih ioqh moqj");
				// return resolve(user);
				//For mail on create
				let transporter = mailConfig.transporter();
				let  html = '<p>Succesfully created an account!<p> </br><p>' + user + '</p>';
				let options = mailConfig.mailOptions(newUser.email,'Welcome to ComPact!', null, html);
				mail.sendMail(transporter, options).then( (info) => {
					console.log("Good path");
					return resolve(newUser);
				}, (error) => {
					console.log("nee");
					return reject(error);
				});
			});
		});	
    },
	/**
	 * Get all users of the databank
	 */
	all : function (){
		console.log("all");
		return new Promise((resolve, reject) => {
			User.find({}, (err, users) => {
				if(err){
					return reject(err);
				}
				return resolve(users);
			});
    	});		
	},
	findOne : function (email){
		console.log("find user");
		return new Promise((resolve, reject) => {
			User.findOne({"email": email}, (err, user) => {
				if(err){
					return reject(err);
				}
				return resolve(user);
			});
    	});		
	},
			
	/**
	 * send mail with link for new password
	 * 
	 */
	forgot : function(email){ 
		console.log("forgot");
		return new Promise((resolve, reject) => {
			User.findOne({email: email}, (err, user) => {
				if(err || !user){
					return reject(err);
				}
				console.log("user found!");
				// Create a token generator with the default settings:
				var randtoken = require('rand-token');
				// Generate a 16 character alpha-numeric token:
				var token = randtoken.generate(16);
				//Session timer
				var timer = new Date();
				//Set 20 minutes as session for the token
				timer.setMinutes(timer.getMinutes() + 20);
				//define token to user
				user.token.body = token;
				user.token.endDate = timer;
				fs.readFile(path.join(__dirname, '../../../views/pages/mail', 'accountCreatedMail.ejs'), 'utf-8', (err, data) => {
					if(err){ 
						return reject(err); 
					}
					else {
						let tokenUrl = 'https://www.localhost:8080/reset?token=' + token;
						var html = ejs.render(data, {tokenUrl: tokenUrl});
						user.save((err, token) => {
							if(err){ return reject(err); }
							//Send mail
							// var html = ejs.render(data, { token });
							let transporter = mailConfig.transporter();
							let options = mailConfig.mailOptions(user.email,'Reset password', null, html);
							console.log("okokokoko");
							mail.sendMail(transporter, options).then( () => {
								console.log("okokokoko");
								return resolve(token);
							},(error) => {
								//Todo: IF ERROR DELETE USER AGAIN
								return reject(error);				
							});
						});
					}
				});
						
			});			
		});
	},
	// edit a user
	resetpw: function(email, password){
		return new Promise((resolve, reject) => {			
			var password = bcrypt.hashSync(password);			
			User.update(
				{email: email},
				{'password': password}, (err, user) => {
					if(err) reject(err);
					console.log("user");	
					resolve(user);
					
				}, err => {
				reject(err);
			});
		});
	},
	// validate token 
	validateToken: function(){

	},
	//login user
	login: function (token){
		
		//return token
	},
	serializeUser: function(user, done){
		passport.serializeUser(function(user, done) {
		done(null, user.id);
		});
	},
	deserializeUser: function(id, done) {
		passport.deserializeUser(function(id, done) {
			User.findById(id, function(err, user) {
				done(err, user);
			});
		});
	}	
 }

 // TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token


//Authentication ---------------------------------------------------------------------------------------------------
/*apiRoutes.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
		  console.log(user.password + " && " + req.body.password);
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        // return the information including token as JSON
        res.json({
          success: true,
          id: user._id
        });
      }   
    }
  });
}); */
//----------
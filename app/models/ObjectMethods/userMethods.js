let User   = require('../user'); // get mongoose model
let session = require('express-session')
let mongoose = require('mongoose');
let nodemailer = require('nodemailer');
let bcrypt = require('bcrypt-nodejs');
let async = require('async');
//let jwt = require('../../../services/jwt');
let mail = require('../lib/mail');
let mailConfig = require('../../../config/mail');
let ejs = require("ejs");
let path = require("path");
let fs =require("fs");
let jwt = require('jsonwebtoken');
let secret = require('../../../config/config').secret;


exports.userMethods = {
	/**
	 * Save user
	 * params(String, String, String, String, Boolean)
	 */
    create: function(params){
		console.log("create");
		return new Promise((resolve, reject) => {
			//create new user
			let newUser = new User({ 
						name: 
						{
							first: params.firstName,
							last: params.lastName
						},
						email: params.email,
						password: params.password,
						admin: params.admin
						// users: Array
						// firstLogin: Boolean,
			});

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
				let randtoken = require('rand-token');
				// Generate a 16 character alpha-numeric token:
				let token = randtoken.generate(16);
				//Session timer
				let timer = new Date();
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
						let html = ejs.render(data, {tokenUrl: tokenUrl});
						user.save((err, token) => {
							if(err){ return reject(err); }
							//Send mail
							// let html = ejs.render(data, { token });
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
			let password = bcrypt.hashSync(password);			
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
		
		
		User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		

		}

	});
	},
	/**
	 * Authenticate login
	 */
	authenticate: function (params){
		return new Promise((resolve, reject) => {
			User.findOne({
				email: params.email
			}, (err, user) => {
				if(!user){
					reject("Incorrect email");
				}
				console.log(user);
				if(err){ return reject(err); }
				//Compare password
				console.log(params.password);
				console.log(user);
				//TODO//COMPARE PASSWORD IS NOT GOOD ATM CHECK IT JEFF
				user.validPassword(params.password).then(() => {
                	console.log("okey");
					// create a token
					// let token = 
                	jwt.sign({ id: user._id }, secret, {
                    	expiresIn : 60*60*24 //24 houres
					}, (err, token) =>{
						if(err){ return reject(error);}
						let user = {
							loginToken: token,
						};
						return resolve(user);
					});
					//console.log("kk");
					//console.log("token", token);
					
					// console.log("kk");
					// console.log(user);
					
				}, error => {
					console.log('err');
					return reject(error);
				});
				
			});
			
		});
	},
	verifyToken: function(params){
		try {
			let id = jwt.verify(params.loginToken, secret).id;
			let user = new User({
				id: id
			});
			
			return user;
		}
		catch(error){
			return null;
		}
		
	}

 }

 // TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
//----------
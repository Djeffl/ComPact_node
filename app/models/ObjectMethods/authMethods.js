let User   = require('../user');
let mongoose = require('mongoose');
let nodemailer = require('nodemailer');
let bcrypt = require('bcrypt-nodejs');
let mail = require('../lib/mail');
let mailConfig = require('../../../config/mail');
let ejs = require("ejs");
let jwt = require('jsonwebtoken');
let secret = require('../../../config/config').secret;
let token = require('../lib/token');
let userModule = require('../ObjectMethods/userMethods');

exports.authMethods = {
	/**
	 * send mail with link for new password
	 * 
	 */
	forgot : function(email){ 
		return new Promise((resolve, reject) => {
			User.findOne({email: email}, (err, user) => {
				if(err || !user){
					return reject(err);
				}
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
	/**
	 * Authenticate login
	 */
	login: function (email, password){
		return new Promise((resolve, reject) => {
			User.findOne({
				email: email
			}, 'id firstName lastName refreshToken email password admin', (err, user) => {
				if(!user){
					reject("Incorrect email");
				}
				if(err){ return reject(err); }
				//Compare password				
				user.validPassword(password)
				.then((userRef) => {
					token.createLogin(userRef.refreshToken)
					.then((logintoken) => {
						userModule.userMethods.AllMembers(user.id)
						.then(members => {
							const response = {
								firstName: user.firstName,
								lastName: user.lastName,
								email: user.email,
								refreshToken: user.refreshToken,
								loginToken: logintoken,
								members: members,
								admin: user.admin
							};
							console.log("response", response);
							resolve(response);
						})
						.catch(error =>{
							reject(error);
						});
					},err => {
					return reject(err);
					});
				}, err => {
					return reject(err);
				});
			}, err => {
				return reject(err);
			});
		});
	},
	verifyToken: function(loginToken){
		try {
			let body = jwt.verify(loginToken, secret);
			return true;
		}
		catch(error){
			return error;
		}
	},
	loginTokenToId: function(loginToken){
		return new Promise((resolve, reject) => {
			jwt.verify(loginToken, secret, (err, body) =>{
				if(err){ return reject(err); }
				return resolve(body.id);

			});
		});
	},
	loginTokenToUser: function(loginToken){
		console.log("parsing loginToken...");
		return new Promise((resolve, reject) => {
			jwt.verify(loginToken, secret, (err, body) => {
				if(body == null || body == undefined){
					return reject("oops");
				}
				User.findById(body.id).then(user => {
					console.log("user found loginTokenId");
					return resolve(user);
				}, err => {
					return reject(err);
				});
			});
		});
	}
 }
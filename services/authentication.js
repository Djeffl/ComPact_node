const userModule = require('../objects/user');
const User = userModule.object;
const tokenModule = require('../services/token');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const ejs = require("ejs");
const jwt = require('jsonwebtoken');
const secret = require('../config/constants').secret;


module.exports = {
    forgot,
	resetpw,
	login,
	loginRefreshToken,
	verifyToken,
	loginTokenToId,
	loginTokenToUser
};

/**
 * Send mail with link for new password
 */
function forgot(email) { 
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
			fs.readFile(path.join(__dirname, '../views/pages/mail', 'accountCreatedMail.ejs'), 'utf-8', (err, data) => {
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
}
	
// edit a user
function resetpw(email, password){
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
}

/**
 * Authenticate login
 */
function login(email, password) {
	return new Promise((resolve, reject) => {
		User.findOne({email: email}, 'id firstName lastName refreshToken email password admin')
		.then(user => {
			if(!user){
				Promise.reject("User does not exist");
			}
			//Compare password
			console.log("pass", password);
			user.validPassword(password)
			.then((isMatch) => {
				//Password is valid
				if(isMatch){
					//userRef.refreshToken
					tokenModule.createLogin(user.refreshToken)
					.then((loginToken) => {
						// userModule.userMethods.AllMembers(user.id)
						// .then(members => {
						const response = {
							_id: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							refreshToken: user.refreshToken,
							loginToken: loginToken,
							//members: members,
							admin: user.admin
						};
						resolve(response);
					});
				}
				//Password is invalid
				else {
					return reject(null);//Promise.reject("Wrong password");
				}
			})
			.catch((err) => {
				reject(err);
			})
		}).catch((err) => {
			console.log("we zitten in de cathc");
				reject(err);
			});;
	});
}

function loginRefreshToken(refreshToken) {
		return new Promise((resolve, reject) => {
			User.findOne({refreshToken: refreshToken})
			.then(user => {
				tokenModule.createLogin(user.refreshToken)
				.then((loginToken) => {
					const response = {
						_id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
						refreshToken: user.refreshToken,
						loginToken: loginToken,
						admin: user.admin
					};
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
			})
			.catch(err => {
				reject(err);
			});
		});

		/*
		return User.findOne({refreshToken: refreshToken})
			.then(user => {
				if (!user) {
					return Promise.reject('User not found.');
				}

				return tokenModule.createLogin(user.refreshToken);
			})	
			.then((loginToken) => {
				const response = {
					_id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					refreshToken: user.refreshToken,
					loginToken: loginToken,
					admin: user.admin
				};
				
				return response;
			});
			*/
}

function verifyToken(loginToken) {
	try {
		let body = jwt.verify(loginToken, secret);
		return true;
	}
	catch(error){
		return error;
	}
}
function loginTokenToId(loginToken) {
		return new Promise((resolve, reject) => {
			jwt.verify(loginToken, secret, (err, body) =>{
				if(err){ return reject(err); }
				return resolve(body.id);
			});
		});
	}

function loginTokenToUser(loginToken) {
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
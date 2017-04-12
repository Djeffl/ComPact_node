let jwt = require('jsonwebtoken');
let secret = require('../../../config/config').secret;
let User   = require('../user');
module.exports = {
	verify: function(req, res, next){
		const token = req.query.token;
		console.log(tokenn);
		jwt.verify(token, secret, (err, tokenBody) => {
			if(err){
				res.send("Invalid");
			}
			req.tokenBody = tokenBody;
			next();
		});
	},
	createRefresh: function(email){
		return new Promise((resolve,reject) => {
			jwt.sign({'email': email,'type': 'refresh'}, secret,{
					expiresIn : 100
					},
			(err, token) => {
				if(err){ reject(err);}
				resolve(token);
			});
		});
	},
	createLogin: function(refreshToken){
		return new Promise((resolve, reject) => {
			User.findOne({refreshToken: refreshToken}, 
			(err, user) => {
				console.log("user ", user);
				if(user == null){
					reject("Internal error: Invalid refreshToken");
				}
				else{
					if(err) { reject(err); }
					else {
						let idUser = user.id;
						console.log("token.js createLogin", idUser);
						jwt.sign({ 'id': idUser, 'type': "login"}, secret, {
							expiresIn : 60*60*24*7 //7 days
						}, (err, token) =>{					
						if(err){ console.log(error); reject(error); }
						resolve(token);
						});
					}
				}
				
			});
		});
	}
}
let User   = require('./object'); // get mongoose model
let session = require('express-session')
let mongoose = require('mongoose');
let nodemailer = require('nodemailer');
let bcrypt = require('bcrypt-nodejs');
let async = require('async');
//let jwt = require('../../../services/jwt');
let mail = require('../../services/mail');
let ejs = require("ejs");
let path = require("path");
let token = require("../../services/token");

module.exports = {
    create,
    createMember,
	readMembers,
	readAll,
	readByMemberId,
	readByEmail,
	readById, 
	update,
	remove
}

/**
 * CREATE
 */
function create(firstName, lastName, email, password) {
	return new Promise((resolve, reject) => {
		token.createRefresh(email)
		.then(refreshToken => {
			let newUser = new User({ 
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				admin: true,
				refreshToken: refreshToken
				// firstLogin: Boolean,
			});
			//save user
			newUser.save({}, (err, user) => {
				if(err){
					reject(err);
				}
				//For mail on create
				const transporter = mailConfig.transporter();
				const  html = '<p>Succesfully created an account!<p> </br><p>' + user + '</p>';
				const options = mailConfig.mailOptions(newUser.email,'Welcome to ComPact!', null, html);
				mail.sendMail(transporter, options)
				.then(() => {
					resolve(user);						
				})
				.catch(err => {
					reject(err);
				});
			})
			.catch(err => {
				reject(err);
			})
		})
		.catch(err => {
			reject(err);
		});	
	});
		
}

function createMember(adminId, firstName, lastName, email, password) {
	return new Promise((resolve, reject) => {
		token.createRefresh(email).then(refreshToken => {
			let member = new User({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				admin: false,
				refreshToken: refreshToken
					// users: Array
					// firstLogin: Boolean,
			});
			console.log("member", member);
			member.save({}, (err, user) => {
				if(err) { return reject(err); }
				console.log("Good path");
				// Assignment.update(
				// 	{'id': id},
				// 	{'name': name, 'description': description}, (err, assignment) => {
				// 		if(err) reject(err);	
				// 		resolve(assignment);
				// 	}, err => {
				// 	reject(err);
				// });
				// User.findOneById(adminId, (err, user) => {
				// 	if(err){ reject(err); }
				// 	console.log("user", user);
				// 	resolve(user);
				// });
				User.findById(adminId).then(admin => {
					if(admin.membersIds=== undefined || admin.membersIds === null){
						admin.membersIds = [];
					}
					admin.membersIds.push(user.id);
					admin.save({}, (err, admin) => {
						if(err) { return reject(err); }
						console.log(admin);
						console.log("solved");
						return resolve(user); 
					});
				},err => {
					reject(err);
				});
			}, error => {
				return reject(error);
			});
		}, error => {
			return reject(error)
		});	
	});		
}

/**
 * READ
 */
function readMembers(adminId) {
	return new Promise((resolve,reject) => {
		User.findById(adminId, (err, user) => {
			console.log("usere", user);
			if(err) { reject(err); }
			if(user == null){
				reject("invalid data");
			}
			else {
				const membersIds = user.membersIds;
				if(membersIds.length != 0){
					User.find({ _id: { $in: membersIds }})
						.then(members => {
							resolve(members);
						});
				}
				else {
					console.log("usermethods AllMembers: No members found");
					return resolve([]);
				}
			}
		});
	});
}

function readByMemberId(memberId) {
	return User.findOne({ membersIds: { $in: [memberId] }});
}

function readByEmail(email) {
	return User.findOne({email: email});
}

function readById(id) {
	return User.findById(id);
}

function readAll(){
	return User.find({});		
}

/**
 * UPDATE
 */
function update(id, updatedUser) {
	return new Promise((resolve,reject) => {			
		User.findByIdAndUpdate(id, updatedUser, {new: true},
		(err, user) => {
				if(err) reject(err);	
				resolve(user);
			}, err => {
			reject(err);
		});
	});
}

/**
 * DELETE
 */
function remove(id) {
	return User.findByIdAndRemove(id);           
}
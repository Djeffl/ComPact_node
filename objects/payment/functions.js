var Payment   = require('./object'); // get mongoose model
var mongoose = require('mongoose');
var async = require('async');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");
var userModule = require('../user/index');
var moment = require('moment');

module.exports = {
    create,
	readAll,
	readById,
	readByUserId,
	readByAdminId,
	update,
	remove,
	removeAll
}

/**
 * CREATE
 */
function create(name, description, price, adminId, memberId, createdAt, path) {
	return new Promise((resolve, reject) => {
		if(adminId == null){
			console.log("CREATED AT", createdAt);
			createdAt = moment(createdAt, ["DD-MM-YYYY HH:mm:ss", "MM-DD-YYYY HH:mm"]);
			console.log("createdAt NOw", createdAt);
			userModule.readByMemberId(memberId)
			.then(user => {
				console.log(adminId);
				adminId = user.adminId;
				console.log(user);
				console.log(adminId);

				let newPayment = new Payment({
					name: name,
					description: description,
					price: price,
					adminId: adminId,
					memberId: memberId,
					createdAt: createdAt,
					image: {
						path: path
					}
				});
				console.log("getting saved...");
				resolve(newPayment.save());
			})
			.catch(err => {
				reject(err);
			});	
		}
		else {
			var newPayment= new Payment({
				name: name,
				description: description,
				price: price,
				adminId: adminId,
				memberId: memberId,
				createdAt: createdAt,
				image: {
					path: path
				}
			});
			console.log(path);
			console.log("getting saved...");
			resolve(newPayment.save());
		}
	});
}

/**
 * READ
 */
function readAll() {
	return Payment.find();	
}

function readByAdminId(adminId) {
	return Payment.find();	
}

function readById(id) {
	return Payment.findById(id);	
}

function readByUserId(userId) {
	return Payment.find({'memberId': userId});	
}

/**
 * UPDATE
 */
function update(id, obj) {
	return new Promise((resolve, reject) => {	
		Payment.findByIdAndUpdate(id, obj, {new: true},
		(err, payment) => {
				if(err) reject(err);	
				resolve(payment);
			}, err => {
			reject(err);
		});
	});
}

/**
 * DELETE
 */
function remove(id) {
	return Payment.findByIdAndRemove(id);           
}

function removeAll() {
	return Payment.remove({});
}
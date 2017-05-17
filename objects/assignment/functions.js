var Assignment   = require('./object'); // get mongoose model
var session = require('express-session')
var mongoose = require('mongoose');
var async = require('async');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");

module.exports = {
    create,
    readAll,
	readByAdminId,
	readById,
	readByUserId,
	update,
	remove, 
	removeAll
}

/**
 * CREATE
 */
function create(itemName, description, iconName, adminId, memberId) {
	const newassignment = new Assignment({ 
		itemName: itemName,
		description: description,
		iconName: iconName,
		adminId: adminId,
		memberId: memberId,
		done: false
	});
	return newassignment.save();
}

/**
 * READ
 */
function readAll() {
	return Assignment.find();	
}

function readByAdminId(adminId){
	return new Promise((resolve,reject)=> {
		Assignment.find({adminId: adminId}).then(assignments => {
			if(assignments.length != 0){
				console.log(assignments);

				resolve(assignments);
			}
			else{
				resolve([]);
			}
		})
		.catch(err => {
			reject(err);
		});
		
	});
}

function readById(id) {
	return Assignment.findById(id);	
}

function readByUserId(userId) {
	return Assignment.find({'memberId': userId});	
}

/**
 * UPDATE
 */
function update(id, obj){
	return new Promise((resolve, reject) => {	
		Assignment.findByIdAndUpdate(id, obj, {new: true},
		(err, assignment) => {
				if(err) reject(err);	
				resolve(assignment);
			}, err => {
			reject(err);
		});
	});
}

/**
 * DELETE
 */
function remove(id){
	return Assignment.findByIdAndRemove(id);
}

function removeAll(){
	return Assignment.remove({});
}
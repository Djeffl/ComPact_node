var Assignment   = require('../assignment'); // get mongoose model
var session = require('express-session')
var mongoose = require('mongoose');
var async = require('async');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");

exports.assignmentMethods = {
	/**
	 * CREATE
	 * params(String, String)
	 */
    create: function(itemName, description, adminId, userId){
		console.log("okok");
		console.log(itemName + " " + description + " "+ adminId + " " + userId);
		var newassignment = new Assignment({ 
			itemName: itemName,
			description: description,
			adminId: adminId,
			userId: userId,
			done: false
		});
		console.log("assig", newassignment);
		console.log("getting saved...");
		return newassignment.save();
    },
	/**
	 * READ
	 */
	all : function (){
		return Assignment.find();	
	},
	//all
	allAdmin : function (adminId){
		return Assignment.find({adminId: adminId});		
	},
	//One by Id
	findOneById : function (id){
		return Assignment.findById(id);	
	},
	//One by Id
	findAllUserTasks : function (userId){
		return assignment.find({'userId': userId});	
	},
	/**
     * UPDATE
     */
    update: function(id, name, descriptions){
		console.log(params);
		params = params[0]
        return new Promise((resolve, reject) => {	
            Assignment.update(
				{'id': id},
				{'name': name, 'description': description}, (err, assignment) => {
					if(err) reject(err);	
					resolve(assignment);
				}, err => {
				reject(err);
			});
        });
    },
    /**
     * DELETE
     */
    delete: function(id){   
        assignment.findByIdAndRemove( id, (err, assignment) => {
            if(err){
                return reject(err);
            }
            //return confirm delete message
            let response = {
                message: "Todo successfully deleted",
                id: assignment._id
            };
            return resolve(response);
        });
    },
	deleteAll: function(){   
        return Assignment.remove({});
    }		
 }
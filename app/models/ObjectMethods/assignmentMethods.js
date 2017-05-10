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
    create: function(itemName, description, iconName, adminId, memberId){
		const newassignment = new Assignment({ 
			itemName: itemName,
			description: description,
			iconName: iconName,
			adminId: adminId,
			memberId: memberId,
			done: false
		});
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
		return new Promise((resolve,reject)=> {
			Assignment.find({adminId: adminId}).then(assignments => {
				if(assignments.length != 0){
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
	},
	//One by Id
	findOneById : function (id){
		return Assignment.findById(id);	
	},
	//One by Id
	findAllUserTasks : function (userId){
		return Assignment.find({'memberId': userId});	
	},
	/**
     * UPDATE
     */
    update: function(id, obj){
        return new Promise((resolve, reject) => {	
            Assignment.findByIdAndUpdate(id, obj, {new: true},
			(err, assignment) => {
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
        return Assignment.findByIdAndRemove(id);
            
		//return confirm delete message
            // let response = {
            //     message: "Todo successfully deleted",
            //     id: assignment._id
            // };
    },
	deleteAll: function(){   
        return Assignment.remove({});
    }		
 }
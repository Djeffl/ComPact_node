var Assignment   = require('../assignment'); // get mongoose model
var session = require('express-session')
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");

exports.assignmentMethods = {
	/**
	 * CREATE
	 * params(String, String)
	 */
    create: function(params){
		console.log(params);
		let name = params.name;
		let description = params.description;
		let userId = params.userId;
		return new Promise((resolve, reject) => {
			//create new assignment
			var newassignment = new Assignment({ 
						name: params.name,
                        description: params.description,
						adminId: params.adminId,
						userId: params.userId
			});
			//save assignment
			newassignment.save({}, (err, assignment) => {
				if(err){
					return reject(err);
				}
				return resolve(assignment);
			});
		});	
    },
	/**
	 * READ
	 */
	all : function (){
		return new Promise((resolve, reject) => {
			Assignment.find((err, assignment) => {
				if(err){
					return reject(err);
				}
				return resolve(assignment);
			});
    	});		
	},
	//all
	allAdmin : function (params){
		return new Promise((resolve, reject) => {
			let adminId = params.adminId;
			// let userId = params.userId;
			Assignment.find({adminId: adminId}, //userId: userId
			(err, assignment) => {
				if(err){
					return reject(err);
				}
				return resolve(assignment);
			});
    	});		
	},
	//One by Id
	findOneById : function (id){
		return new Promise((resolve, reject) => {
			Assignment.findById(id, (err, assignment) => {
				if(err){
					return reject(err);
				}
				console.log(assignment);

				return resolve(assignment);
			});
    	});		
	},
	//One by Id
	findAllUserTasks : function (userId){
		return new Promise((resolve, reject) => {
			assignment.find({'userId': userId},
			(err, assignments) => {
				if(err){
					return reject(err);
				}
				return resolve(assignments);
			});
    	});		
	},
	/**
     * UPDATE
     */
    update: function(id, params){
        // let name = params.name;
        // let description = params.description;
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
    }			
 }
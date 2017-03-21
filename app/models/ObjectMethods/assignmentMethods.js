"use strict";

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
    create: function(...params){
		return new Promise((resolve, reject) => {
			//create new assignment
			var newassignment = new Assignment({ 
						name: params.name,
                        describtion: params.description
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
	//all
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
	//One by Id
	findOneById : function (id){
		return new Promise((resolve, reject) => {
			assignment.findById(id, (err, assignment) => {
				if(err){
					return reject(err);
				}
				return resolve(assignment);
			});
    	});		
	},
	//One by params
	// findOne : function(...params){
	// 	return new Promise((resolve, reject) => {
	// 		assignment.findOne({
	// 			//params	
	// 		}, (err, assignment) => {
	// 			if(err){
	// 				return reject(err);
	// 			}
	// 			return resolve(assignment);
	// 		});
    // 	});	
	// },
	/**
     * UPDATE
     */
    update: function(id, ...params){
        let name = params.name;
        let description = params.description;
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
            var response = {
                message: "Todo successfully deleted",
                id: assignment._id
            };
            return resolve(response);
        });
    }			
 }
var Payment   = require('../payment'); // get mongoose model
var mongoose = require('mongoose');
var async = require('async');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");

exports.paymentMethods = {
	/**
	 * CREATE
	 * params(String, String)
	 */
    create: function(name, description, price, adminId, memberId){
		var newPayment= new Payment({
            name: name,
            description: description,
            price: price,
            adminId: adminId,
            memberId: memberId
        });
		console.log("getting saved...");
		return newPayment.save();
    },
	/**
	 * READ
	 */
	all : function (){
		return Payment.find();	
	},
	//all
	allAdmin : function (adminId){
		return Payment.find({adminId: adminId});		
	},
	//One by Id
	findOneById : function (id){
		return Payment.findById(id);	
	},
	//One by Id
	findAllUserPayments : function (userId){
		return Payment.find({'memberId': userId});	
	},
	/**
     * UPDATE
     */
    update: function(id, obj){
        return new Promise((resolve, reject) => {	
            Payment.findByIdAndUpdate(id, obj, {new: true},
			(err, payment) => {
					if(err) reject(err);	
					resolve(payment);
				}, err => {
				reject(err);
			});
        });
    },
    /**
     * DELETE
     */
    delete: function(id){   
        return Payment.findByIdAndRemove(id);
            
		//return confirm delete message
            // let response = {
            //     message: "Todo successfully deleted",
            //     id: assignment._id
            // };
    },
	deleteAll: function(){   
        return Payment.remove({});
    }		
 }
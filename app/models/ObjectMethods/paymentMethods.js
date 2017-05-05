var Payment   = require('../payment'); // get mongoose model
var mongoose = require('mongoose');
var async = require('async');
var ejs = require("ejs");
var path = require("path");
var fs =require("fs");
var userModule = require("../ObjectMethods/userMethods");

exports.paymentMethods = {
	/**
	 * CREATE
	 * params(String, String)
	 */
    create: function(name, description, price, adminId, memberId, createdAt, path){
		return new Promise((resolve, reject) => {
			if(adminId == null){
				userModule.userMethods.findOneById(memberId)
				.then(user => {
					console.log(adminId);
					adminId = user.adminId;
					console.log(user);
					console.log(adminId);

					var newPayment = new Payment({
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
					console.log()
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
    },
	/**
	 * READ
	 */
	all : function (){
		return Payment.find();	
	},
	//all
	allAdmin : function (adminId){
		
		return Payment.find();	
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
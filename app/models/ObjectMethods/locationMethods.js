let Location = require('../location'); // get mongoose model
let mongoose = require('mongoose');

exports.locationMethods = {
	/**
	 * CREATE
	 * params(String, String)
	 */
    create: function(adminId, name, city, streetAndNumber, radius, membersIds, latitude, longitude){
        console.log(adminId);
        let newLocation = new Location({
            adminId: adminId,
            name: name,
            city: city,
            streetAndNumber: streetAndNumber,
            radius: radius,
            membersIds: membersIds,
            latitude: latitude,
            longitude: longitude
        });
        console.log(newLocation);
        console.log("getting saved...");
        return newLocation.save();   
    },
	/**
	 * READ
	 */
	all : function (){
		return Location.find();	
	},
	//all
	allAdmin : function (adminId){
		return Location.find();	
	},
	//One by Id
	findOneById : function (id){
		return Location.findById(id);	
	},
	//One by Id
	findAllUserPayments : function (userId){
		return Location.find({'memberId': userId});	
	},
	/**
     * UPDATE
     */
    update: function(id, obj){
        return new Promise((resolve, reject) => {	
            Location.findByIdAndUpdate(id, obj, {new: true},
			(err, location) => {
					if(err) reject(err);	
					resolve(location);
				}, err => {
				reject(err);
			});
        });
    },
    /**
     * DELETE
     */
    delete: function(id){   
        return Location.findByIdAndRemove(id);
            
		//return confirm delete message
            // let response = {
            //     message: "Todo successfully deleted",
            //     id: assignment._id
            // };
    },
	deleteAll: function(){   
        return Location.remove({});
    }		
 }
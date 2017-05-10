const Location = require('../location'); // get mongoose model
const mongoose = require('mongoose');
const pushNotificationMethods = require('./pushNotificationMethods');
const userModule = require('./userMethods');

//module.exports is beter
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
        return new Promise((resolve,reject)=> {
			Location.find({adminId: adminId}).then(locations => {
				if(locations.length != 0){
					resolve(locations);
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
    },
    currentLocation: function(memberId, latitude, longitude) {
        userModule.userMethods.FindAdminByMember(memberId)
        .then(admin => {
            console.log("admin found!");
            let options = {
                host: 'maps.googleapis.com',
                port: 443,
                path: '/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + config.googleApiKey,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            jsonRequest.getJSON(options, (statusCode, result) => {
                let locationData = result.results[0].formatted_address.split(',');
                let street = locationData[0];
                let city = locationData[1];
                //let city = locationData[2];

                console.log(admin);
                console.log(admin.id);
                console.log(admin.fireBaseToken)
                locationModule.locationMethods.create(admin.id, "I Am Here", city, street, 0, memberId, latitude, longitude)
                .then(response => {
                    res.send(response);
                    /**
                     * Push notification
                     */
                    pushNotificationMethods.sendMessage("message", admin.fireBaseToken,  (err,devices) => { 
                        console.log("ik zit in de callback");
                    });
                })
                .catch((err) => {
                    res.status(401).send(err);
                });
            });
        })
        .catch((err) => {
            res.send(err);
        })
    }
}
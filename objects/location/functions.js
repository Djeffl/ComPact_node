/**
 * CREATE
 */
const Location = require('./object');
const mongoose = require('mongoose');
const notificationService = require('../../services/notification');
const userModule = require('../user/index');
const config = require('../../config/constants');
const jsonRequest = require('../../services/jsonRequest');
module.exports = {
    create,
    readAll,
    readByAdminId,
    readById,
    readByUserId,
    update,
    remove,
    removeAll,
    sendLocation,
    sendGeoLocationUpdate
}

function create(adminId, name, city, streetAndNumber, radius, membersIds, latitude, longitude, isGeofence) {
    return new Promise((resolve, reject) => {
        streetAndNumber = streetAndNumber.split(' ').join('+');
        console.log('/maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + streetAndNumber + '&key=' + config.googleApiKey);
        console.log(streetAndNumber);
        let pathUrl = ('/maps/api/geocode/json?address=' + city + ',' + streetAndNumber + '&key=' + config.googleApiKey).replace(/\s/g,'');
        let options = {

            host: 'maps.googleapis.com',
            port: 443,
            path: pathUrl,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        jsonRequest.getJSON(options, (statusCode, result) => {
            console.log(result.results[0]);
            let locationData = result.results[0].geometry.location;//.formatted_address.split(',');

            let latitude = locationData.lat;
            let longitude = locationData.lng;
            // let street = locationData[0];
            // let city = locationData[1];
            //let city = locationData[2];
            console.log("locationData");

            console.log(locationData);

            if (latitude != 0 && longitude != 0) {
                let newLocation = new Location({
                    adminId: adminId,
                    name: name,
                    city: city,
                    streetAndNumber: streetAndNumber,
                    radius: radius,
                    membersIds: membersIds,
                    latitude: latitude,
                    longitude: longitude,
                    isGeofence: isGeofence
                });
                console.log("okeysssss");
                console.log(newLocation);

                newLocation.save().then(location => {
                    return resolve(location);
                }).catch(err => {
                    return reject(err);
                });
            }
            ;
        });
    });


    // }else{
    //     let newLocation = new Location({
    //         adminId: adminId,
    //         name: name,
    //         city: city,
    //         streetAndNumber: streetAndNumber,
    //         radius: radius,
    //         membersIds: membersIds,
    //         latitude: latitude,
    //         longitude: longitude,
    //         isGeofence: isGeofence
    //     });
    //     console.log("okeyyy");
    //     console.log(newLocation);
    //     return newLocation.save();
    // }
    //         });

}
/**
 * READ
 */
function readAll(){
    return Location.find();	
}
function readByAdminId(adminId) {
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
}
function readById(id) {
    return Location.findById(id);	
}

function readByUserId(userId) {
   return new Promise((resolve,reject) => {
        userModule.readByMemberId(userId)
        .then( admin => {
            Location.find({'adminId': admin.id, isGeofence: true})
            .then(locations => {
                return resolve(locations);
            })
            .catch(err => {
                return reject(err);
            })
        })
        .catch((err) => {
            return reject(err);
        });
   });
}

/**
 * UPDATE
 */
function update(id, obj) {
    return new Promise((resolve, reject) => {	
        Location.findByIdAndUpdate(id, obj, {new: true},
        (err, location) => {
                if(err) reject(err);	
                resolve(location);
            }, err => {
            reject(err);
        });
    });
}

/**
 * DELETE
 */
function remove(id) {   
    return Location.findByIdAndRemove(id);
}

function removeAll(){   
    return Location.remove({});
}

/**
 * OTHERS
 */
function sendLocation(memberId, latitude, longitude) {
    return new Promise((resolve,reject) => {
        userModule.readByMemberId(memberId)
        .then(admin => {
            console.log("memberId", memberId);
            console.log("admin found!");
            console.log("path", '/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + config.googleApiKey)
            console.log(admin);
            let pathUrl = ('/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + config.googleApiKey).replace(/\s/g,'');
            let options = {
                host: 'maps.googleapis.com',
                port: 443,
                path: pathUrl,
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
                console.log("okeotjeiotnoi");

                 console.log(admin);
                 console.log(admin.id);
                // console.log(admin.fireBaseToken)
                create(admin.id, "I Am Here", city, street, 0, memberId, latitude, longitude, false)
                .then(response => {
                    resolve(response);
                    /**
                     * Push notification
                     */
                    userModule.readById(memberId)
                        .then( member => {
                            userModule.readByMemberId(memberId)
                            .then( admin => {
                                console.log("admin", admin);
                                notificationService.sendMessage(city+ " " + street, member,[admin.fireBaseToken],  (err,devices) => {
                                console.log("ik zit in de callback");
                                return resolve(response);
                            });

                         });
                    });
                    
                }) 
                .catch((err) => {
                    reject(err);
                });
            });
        })
        .catch((err) => {
            reject(err);
        })
    });
}
function sendGeoLocationUpdate(memberId, msg) {
    return new Promise((resolve, reject) => {
        userModule.readById(memberId)
            .then( member => {
                userModule.readByMemberId(memberId)
                    .then(admin => {
                        console.log("FireBaseToken", admin.fireBaseToken);

                        notificationService.sendMessage(msg, member, [admin.fireBaseToken], (err, devices) => {
                            if(err){
                                console.log(err);
                            }
                            else {
                                console.log(devices);
                            }
                            console.log("ik zit in de callback");
                        });
                    })
                    .catch((err) => {

                        reject(err);
                    });
            })
            .catch( err => {
                console.log(err);
            });
    });
}

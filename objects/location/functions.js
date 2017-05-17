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
    currentLocation
}

/**
 * CREATE
 */
function create(adminId, name, city, streetAndNumber, radius, membersIds, latitude, longitude, isGeofence) {
     //streetAndNumber = streetAndNumber.split(' ').join('+');
    //  console.log('/maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + streetAndNumber + '&key=' + config.googleApiKey);
    //  console.log(streetAndNumber);
    // let options = {
       
    //             host: 'maps.googleapis.com',
    //             port: 443,
    //             path: '/maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + streetAndNumber + '&key=' + config.googleApiKey,
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         };
    //         jsonRequest.getJSON(options, (statusCode, result) => {
    //             let locationData = result.results[0].formatted_address.split(',');
    //             // let street = locationData[0];
    //             // let city = locationData[1];
    //             //let city = locationData[2];
    //             console.log(locationData);

    if(latitude != 0 && longitude != 0){
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
        console.log("okey");
        console.log(newLocation);
        return newLocation.save(); 
        
    }else{
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
        console.log("okey");
        console.log(newLocation);
        return newLocation.save(); 
    }
   // });

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
function currentLocation(memberId, latitude, longitude) {
    return new Promise((resolve,reject) => {
        userModule.readByMemberId(memberId)
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
                console.log("okeotjeiotnoi");

                // console.log(admin);
                // console.log(admin.id);
                // console.log(admin.fireBaseToken)
                create(admin.id, "I Am Here", city, street, 0, memberId, latitude, longitude, false)
                .then(response => {
                    resolve(response);
                    /**
                     * Push notification
                     */
                    userModule.readById(memberId).then( member => {
                        notificationModule.currentLocation(city+ " " + street, member,["d-2Gdu1SdI4:APA91bFCRXFisAi3J9fLQIX_BgJe5C_mlhJX3fQMLAG8ILMWJpOF_Kw2lDPw2mlWMfMqfRMRf0XIUcUfNfYz-mJrIchu-GuHAdU42qnh2b9LyDHUwO-fRc8j_540q_0nX_FUeUbTf0TB"],  (err,devices) => { 
                        console.log("ik zit in de callback");
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

const Location = require('./object');
const mongoose = require('mongoose');
const notificationModule = require('../notification');
const userModule = require('../user/index');

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
function create(adminId, name, city, streetAndNumber, radius, membersIds, latitude, longitude) {
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
    return newLocation.save();   
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
    return Location.find({'memberId': userId});	
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

            console.log(admin);
            console.log(admin.id);
            console.log(admin.fireBaseToken)
            create(admin.id, "I Am Here", city, street, 0, memberId, latitude, longitude)
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

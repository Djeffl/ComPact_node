const mongoose = require('mongoose');
const request = require('request');
const device = require('../device');
const gcm = require('node-gcm');
const messages = require('../../config/messages');


module.exports = {
    create,
    readByRegistrationId,
    sendMessage
}

function create(deviceName,deviceId,registrationId) {
    const newDevice = new device({ 
        deviceName : deviceName,
        deviceId   : deviceId,
        registrationId : registrationId
    });
    return new Promise((resolve, reject) => {
        find(registrationId)
        .then((devices) => {
            if(devices.length != 0){
                return reject("Device already exists");
            }
            return newDevice.save()
            .then((device) => {
                resolve(device);
            })
            .catch((err) => {
                reject(err);
            });
        })
        .catch((err) => {
            reject(err);
        });
    })
}


    // delete: () => {
    //     return device.findOneAndRemove({registrationId:registrationId});
    // },
function sendMessage(msg,registrationId,callback){
    const message = new gcm.Message({data: {message: message}});
    const regTokens = [registrationId];
    const sender = new gcm.Sender(messages.gcm_api_key);
    sender.send(message, { registrationTokens: regTokens }, function (err, response) {

        if (err){
            console.error(err);
            callback(messages.error.msg_send_failure);
        } else {
            console.log(response);
            callback(messages.success.msg_send_success);
        }

    });
}
/**
 * @param {string} [registrationId] - registrationId is optional
 */
function readByRegistrationId(registrationId) {
    if(registrationId == null){
        return device.find();
    }
    return device.find({registrationId : registrationId});
}
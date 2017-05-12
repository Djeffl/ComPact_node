const Gcm = require('node-gcm');
const functions = require('./functions');

module.exports = {
    object: Gcm,
    currentLocation: functions.sendMessage
}
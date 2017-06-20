const Device = require('./object');
const functions = require('./functions');

module.exports = {
    object: Device,
    create: functions.create,
    readByRegistrationId: functions.readByRegistrationId,
}
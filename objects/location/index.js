const Location = require('./object');
const functions = require('./functions');

module.exports = {
    object: Location,
    create: functions.create,
    readAll: functions.readAll,
    readByAdminId: functions.readByAdminId,
    readById: functions.readById,
    readByUserId: functions.readByUserId,
    update: functions.update,
    remove: functions.remove,
    removeAll: functions.removeAll,
    sendLocation: functions.sendLocation,
    sendGeoLocationUpdate: functions.sendGeoLocationUpdate
}
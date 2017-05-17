const Assignment = require('./object');
const functions = require('./functions');

module.exports = {
    object: Assignment,
    create: functions.create,
    readAll: functions.readAll,
    readByAdminId: functions.readByAdminId,
    readById: functions.readById,
    readByUserId: functions.readByUserId,
    update: functions.update,
    remove: functions.remove,
    removeAll: functions.removeAll,
}
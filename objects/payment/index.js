const Payment = require('./object');
const functions = require('./functions');

module.exports = {
    object: Payment,
    create: functions.create,
    read: functions.readAll,
    readByAdminId: functions.readByAdminId,
    readById: functions.readById,
    readByUserId: functions.readByUserId,
    update: functions.update,
    remove: functions.remove,
    RemoveAll: functions.removeAll
}
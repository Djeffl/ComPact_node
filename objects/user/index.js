const User = require('./object');
const functions = require('./functions');

module.exports = {
    object: User,
    create: functions.create,
    readAll: functions.readAll,
    readByEmail: functions.readByEmail,
    readById: functions.readById,
    readByMemberId: functions.readByMemberId,
    readMembers: functions.readMembers,
    update: functions.update,
    delete: functions.remove,
    addMember: functions.createMember,
    getMembers: functions.readMembers
    //Todo Delete
}
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
    addMember: functions.addMember,
    getMembers: functions.getMembers
    //Todo Delete
}
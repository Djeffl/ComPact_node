const jwt = require('jsonwebtoken');
const functions = require('./functions');

module.exports = {
    object: jwt,
    verify: functions.verify,
    createRefresh: functions.createRefresh,
    createLogin: functions.createLogin
}
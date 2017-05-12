const Nodemailer = require("nodemailer");
const functions = require('./functions');

module.exports = {
    object: Nodemailer,
    transporter: functions.transporter,
    options: functions.options,
    sendMail: functions.sendMail
}
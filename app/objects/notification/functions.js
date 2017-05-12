const gcm = require('node-gcm');
const config = require('../../../config/config');

module.exports = {
    sendMessage
}

function sendMessage(message,registrationId, callback){
    var msg = new gcm.Message();

    msg.addData(message);
    msg.addNotification(message);

    var regTokens = registrationId;
    var sender = new gcm.Sender(config.fireBaseApiKey);
    sender.send(message, { registrationTokens: regTokens },   
    (err, res) => {
        if (err){
            callback(err);
 
        } else {
            callback("success");
        }
    });
}
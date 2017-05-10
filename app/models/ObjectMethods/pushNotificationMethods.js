const gcm = require('node-gcm');
const config = require('../../../config/config');

exports.sendMessage = function(message,registrationId, callback){
 
    var message = new gcm.Message({data: {message: message}});
    var regTokens = [registrationId];
    var sender = new gcm.Sender(config.googleApiKey);
    sender.send(message, { registrationTokens: regTokens },  (err, res) => {
 
        if (err){
            console.error(err);
            callback("error");
 
        } else {
            callback("success");
        }
 
    });
 
}
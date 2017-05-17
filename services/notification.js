const gcm = require('node-gcm');
const config = require('../config/constants');

module.exports = {
    sendMessage
}

function sendMessage(message, member, registrationId, callback){
    var msg = new gcm.Message();
    msg.addData(message);
    msg.addNotification({
		title: member.firstName + "'s location",
		icon: "ic_launcher",
		body: message
	});
    // msg.addNotification(message);
    console.log("MESASAD Z" , message);
    console.log("msg", msg);

    var regTokens = registrationId;
    var sender = new gcm.Sender(config.fireBaseApiKey);
    sender.send(msg, { registrationTokens: regTokens },   
    (err, res) => {
        if (err){
            callback(err);
 
        } else {
            callback(res);
        }
    });
}
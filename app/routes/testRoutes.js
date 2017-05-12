const express = require('express');
const router = express.Router();
//const authModule = require("../ObjectMethods/authMethods");
//const deviceMethods = require("../ObjectMethods/deviceMethods");
const  noticationModule = require("../objects/notification/index");
const gcm = require('node-gcm');



router.get("/", (req, res) => {
    // var message = new gcm.Message();

    // // Add notification payload as key value
    // message.addNotification('title', 'Alert!!!');
    // message.addNotification('body', 'Abnormal data access');
    // message.addNotification('icon', 'ic_launcher');
    var message = new gcm.Message();
 
    // Add notification payload as key value 
    // message.addNotification('title', 'Alert!!!');
    // message.addNotification('body', 'Abnormal data access');
    // message.addNotification('icon', 'ic_launcher');
    
    // as object 
    message.addNotification({
    title: 'Alert!!!',
    body: 'Abnormal data access',
    icon: "ic_launcher",
    sound: 'default'
    });
    message.addData( {
        title: 'Alert!!!',
        body: 'Abnormal data access',
        icon: "ic_launcher",
        sound: 'default'
    });

    // as object
    // message.addNotification({
    // title: 'Alert!!!',
    // body: 'Abnormal data access',
    // icon: 'ic_launcher'
    // });
    var registrationTokens = ["djbOzt6nRco:APA91bGZ_oEtAbzy__OhtxYwIIAVeH_thHw-W9bF8QclAplMDyQa-t8VFdnIH50jsayy5dI2uuiCS5FrJZS0DMGp0xPO7bod1DC0u8fB4DilKs76bjPQpYjBK7beBsTQBRy5OkniTx0n"];
    noticationModule.sendMessage(message, registrationTokens, (result) => 
    {
        res.send(result);
    });
});


module.exports = router;

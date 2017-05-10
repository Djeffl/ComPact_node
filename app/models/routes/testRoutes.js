const express = require('express');
const router = express.Router();
const authModule = require("../ObjectMethods/authMethods");
const deviceMethods = require("../ObjectMethods/deviceMethods");
const  noticationMethods = require("../ObjectMethods/pushNotificationMethods");


router.get("/", (req, res) => {
    noticationMethods.sendMessage("BackendMessage", "dH1XQsWTihM:APA91bHYm0lzs2ev840qsiUnUjIx09-8n8ZN30KSw2cDRCU3S2x9a8p9wAUKA3WAcLoLBuh8Qu7jDyGLTiKxEzd42pvBkwDYl4NyX_hzC_z3n4YJxi2CObCQ4pKKEV9yR3_CggqTSjVY", 
    () => {
        console.log("callback");
    });
});


module.exports = router;

const mongoose = require('mongoose');
 
var Schema = mongoose.Schema;
 
var deviceSchema = mongoose.Schema({

    deviceName : String,
    deviceId : String, 
    registrationId : String
    
});
module.exports = mongoose.model('Device', deviceSchema);
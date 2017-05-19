var mongoose = require('mongoose'); //db connection

// Define schema of a location
var locationSchema = mongoose.Schema({
    adminId: {type:String, required: false},
    name: {type:String, required: false},
    city: {type:String, required: false},
    streetAndNumber: { type: String, required: false},
    radius: {type:Number, required: false},
    membersIds: {type: Array, required: false},
    latitude: {type:Number, required: false},
    longitude: {type:Number, required: false},
    isGeofence: {type:Boolean, required: false }
});
//methods ==========================================

//==================================================

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);
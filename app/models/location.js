var mongoose = require('mongoose'); //db connection

// Define schema of a location
var locationSchema = mongoose.Schema({
    adminId: {type:String, required: true},
    name: {type:String, required: true},
    city: {type:String, required: true},
    streetAndNumber: { type: String, required: true},
    radius: {type:Number, required: false},
    membersIds: {type: Array, required: false},
    latitude: {type:Number, required: false},
    longitude: {type:Number, required: false}
    
});
//methods ==========================================

//==================================================

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);
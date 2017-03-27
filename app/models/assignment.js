var mongoose = require('mongoose'); //db connection
// Define schema
var assignmentSchema = mongoose.Schema({
    //assignmentName: { type: String, required: true, index: { unique: true }},
    name: { type: String, required: true },
    description: {type:String, required: false},
    adminId: {type: String, required: true},
    userId: { type:String, required: false}
});

// create the model and expose it to our app
module.exports = mongoose.model('Assignment', assignmentSchema);

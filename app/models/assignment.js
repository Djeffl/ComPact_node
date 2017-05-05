var mongoose = require('mongoose'); //db connection
// Define schema
var assignmentSchema = mongoose.Schema({
    //assignmentName: { type: String, required: true, index: { unique: true }},
    itemName: { type: String, required: true },
    description: {type:String, required: false},
    iconName: {type:String, required: true},
    adminId: {type: String, required: true},
    done: {type: Boolean, required: true},
    memberId: { type:String, required: true}
});

// create the model and expose it to our app
module.exports = mongoose.model('Assignment', assignmentSchema);

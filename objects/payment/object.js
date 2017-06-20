var mongoose = require('mongoose'); //db connection
// Define schema
var paymentSchema= mongoose.Schema({
    name: { type: String, required: true },
    description: {type:String, required: false},
    price: {type:Number, required: true},
    adminId: {type: String, required: false},
    memberId: { type:String, required: false},
    createdAt: {type:Date, required: false},
    image: {
        path: {type:String, required: false}
    }
});

// create the model and expose it to our app
module.exports = mongoose.model('Payment', paymentSchema);
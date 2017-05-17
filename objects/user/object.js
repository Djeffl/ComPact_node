const mongoose = require('mongoose'); //db connection
const bcrypt = require('bcrypt-nodejs');
const uniqueValidator = require('mongoose-unique-validator');
const uuid = require('node-uuid');

// Define schema of user
const SALT_FACTOR = 5;
const userSchema = mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},
    email: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false },
    admin: {type: Boolean, required: true},
    token: {
      body: {type:String, required: false},
      endDate: {type:Date, required: false}
    },
    membersIds: {type: Array, required: false},
    refreshToken: {type: String, required: false},
    fireBaseToken: {type: String, required:false}
    // firstLogin: Boolean,
});

//Define encryption for password
userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Plugin for unique
 */
userSchema.plugin(uniqueValidator);
//methods ==========================================
// generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

/**
 * Checking if password is valid
 */
userSchema.methods.validPassword = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, match) => {
      if(err){
        reject(err);
      }
      else{
        resolve(match);
      }
  });
});
}

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
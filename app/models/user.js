var mongoose = require('mongoose'); //db connection
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
// Define schema of user
var userSchema = mongoose.Schema({
    name: {
        first: {type:String, required: true},
        last: {type:String, required: true}
    },
    email: { type: String, required: true, index: { unique: true }},
    // password: { type: String, required: true, select: false },
    password: { type: String, required: true },
    admin: {type: Boolean, required: true},
    token: {
      body: {type:String, required: false},
      endDate: {type:Date, required: false}
    }
    // users: Array
    // firstLogin: Boolean,
});

//Define encryption for password
userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

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

//checking if password is valid
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
            cb(null, isMatch);
    });
};

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);




// router.route('/')
//     .get(function(req,res){
//         res.send('Users/');
//     })
// router.route('/user')
//     .get(function(req,res){
//         var email = req.param('email');
//         var password = req.param('password');
//         if(password != null) {
//             // Todo: login request
//         }
//         else {
//             // Todo: reset password
//         }
//         res.send(req.param('email'));
//     })
    
// router.route('/new')
//     .get(function(req,res){
//         // Todo only for web
//     })
//     // Create user
//     .post(function(req,res){
//         var lastName = req.param('lastName');
//         var firstName = req.param('firstName');
//         var email = req.param('email');
//         var password = req.param('password');
//         var admin = req.param('admin');
//         register(lastName, firstName, email, password, admin);
//         res.send(lastName + firstName + email);
//     })
//     .post(function(req,res){
//         res.send(req.params);
//     })

// // app.post('/', function (req, res) {
// //   res.send('Got a POST request')
// // })
// // Respond to a PUT request to the /user route:

// // app.put('/user', function (req, res) {
// //   res.send('Got a PUT request at /user')
// // })
// // Respond to a DEvarE request to the /user route:

// // app.devare('/user', function (req, res) {
// //   res.send('Got a DEvarE request at /user')
// // })

// module.exports = router;

// // app.route('/users')
// //   .get(function (req, res) {
// //     res.send('Get a random book')
// //   })
// //   .post(function (req, res) {
// //     res.send('Add a book')
// //   })
// //   .put(function (req, res) {
// //     res.send('Update the book')
// //   })
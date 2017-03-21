var passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy;

 module.exports = function() {
    localStrat
 };

 var localStrat = passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField:'password'
},
    function(email, password, done){
        console.log("okey");
        var user = {
            Email: email,
            Password: password
        }
        done(null, user);
    //     console.log("ok hier");
    //     User.findOne({ email: email }, function(err, user) {
    //             console.log("zoeken...");
    //             if(err) console.log("err hier"); return(done(err)); 
    //             if(!user){
    //                 console.log("err hier");
    //                 return done(null, false, {message: 'unknown user'});
    //             }
    //             console.log("err hifafafaer");
    //             user.comparePassword(password, function(err, isMatch) {
    //                 console.log("er leleleelel");
	// 			if (isMatch) {
    //                 console.log("juist");
	// 				return done(null, user);
	// 			} else {
    //                 console.log("err hier");
	// 				return done(null, false, { message: 'Incorrect password.' });
    //             }    
    //         });
    //     });
    }
));
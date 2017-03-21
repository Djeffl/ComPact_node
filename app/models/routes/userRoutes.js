var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird"); // NOTE: bluebird's promise performance *4
var User   = require('../user'); // get our mongoose model
var userModule = require('../ObjectMethods/userMethods');
var session = require('express-session')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

var passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy;
// =====================================
// All =================================
// =====================================
router.get('/', function(req, res) {
    //Get all users from userMethods
    userModule.userMethods.all().then(users => {
        res.send(users);
    }, error => {
        console.log(error);
    });
});
// =====================================
// New =================================
// =====================================
router.route('/create')
    // page
    .get(function(req,res){
        // Todo only for web
        res.send('Create user test');
    })
    // Create user
    .post(function(req,res){
        console.log(req.body);
        var lastName = req.body.lastName;
        var firstName = req.body.firstName;
        var email = req.body.email;
        var password = req.body.password;
        var admin =  req.body.admin;
        
        userModule.userMethods.create(firstName, lastName, email, password, admin).then( (user) => {
            console.log("solved");
            res.status(200).send({
                user: user
            });
        }, error => {
            console.log("error");
            res.status(400).send(error);
        });
    });
// =====================================
// Resetpw===============================
// =====================================
router.route('/resetpassword')
    // page
    .get(function(req,res){
        // Todo only for web
        var email = req.body.email;
        var newPassword = req.body.password;
        userModule.userMethods.resetpw(email, newPassword).then(user => {
            console.log("user ", user);
                res.send(user);
        }, error => {
            console.log(error);
            res.send(error);
        });
    });

router.route('/forgot')
    .post(function(req, res){
        var email = req.body.email;
        userModule.userMethods.forgot(email).then(user => {
            res.send("There has been an email send to reset your password!");
        },error => {
            console.log(error);
            res.send(error);
        });
    });
// =====================================
// Login===============================
// =====================================


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//EXTRACT FROM HERE
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done("Incorrect Email");
      }
      if (!user.comparePassword(password, function(err, isMatch) {
				if(err){ return done("Incorrect password"); }
                return done(null, user);
      }));
    });
}));

router.route('/login')
    .post( function(req, res, next){
        passport.authenticate('local', function(err, user, info) {
            var result = new User({ 
                        _id:null,
						// name: 
						// {
						// 	first: null,
						// 	last: null
						// },
						email: user.email,
						password: req.body.password,
						// admin: null
						// users: Array
						// firstLogin: Boolean,
			});
            if(err) { res.send(err); }
            req.logIn(user, function(err){
                if(err) { res.send(err)}
                return res.send(JSON.stringify(result));
            });
        })(req, res, next);
    });

    // }    (req, res) => {
    //     console.log("test");
    //     console.log("id", id)
    //     console.log("user", user);
    //     console.log("user",user.email);
    //     console.log("password", user.password);
    //     res.status(200).send({
    //         email: user.email,
    //         password: user.password
    //     });
    // });

// router.route('/login')
// .post(passport.authenticate('local', 
//     {}),(req, res) => {
//         console.log("test");
//         console.log("id", id)
//         console.log("user", user);
//         console.log("user",user.email);
//         console.log("password", user.password);
//         res.status(200).send({
//             email: user.email,
//             password: user.password
//         });
//     });
    // .post(function(req,res){
    // //     console.log("ok hier"); 
    //    passport.authenticate('local'),
    //    function()
    //    (err, user) => {
    //        console.log("ok hier");
    //        if(err) console.log("ok hier2"); res.send(err); 
    //        res.send("Logged in! ", user);
    //    } 
    // });
//   res.send(req.user);
    // });

router.get('/logout', function(req, res){
    // res.send("user: ", req.user);
//   req.logout();
//   res.send("succesfully logged out");
});

                                                                                                        //disable session
                                                                                                        // app.get('/api/users/me',
                                                                                                        //   passport.authenticate('basic', { session: false }),
                                                                                                        //   function(req, res) {
                                                                                                        //     res.json({ id: req.user.id, username: req.user.username });
                                                                                                        //   });                
                
//     }
// ))
// router.post('/login',urlencodedParser, function(req, res, next) {
//     var email = req.param('email');
//     var password = req.param('password');
//     console.log(email + " " + password);
//     // userModule.userMethods.login(email,password);
//     passport.authenticate('local', function(err, user, info) {
//     console.log(info);
//     if (err) return next(err)
//     if (!user) {
//       return res.send("not logged in");
//     }
//     req.logIn(user, function(err) {
//       if (err) return next(err);
//       return res.send("login");
//     });
//   })(req, res, next);
// });
// // =====================================
// // Logout===============================
// // =====================================
// router.get('/logout', function(req, res){
//   req.logout();
//   res.send("u have been logged out");
  
// });

module.exports = router;
let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
mongoose.Promise = require("bluebird"); // NOTE: bluebird's promise performance *4
let User   = require('../user'); // get our mongoose model
let authModule = require('../ObjectMethods/authMethods');
let userModule = require('../ObjectMethods/userMethods');
let bcrypt = require('bcrypt-nodejs');
let async = require('async');

// =====================================
// Resetpw===============================
// =====================================
router.get('/', (req,res) => {
    res.send("ok");
});
router.route('/create')
    // page
    .get(function(req,res){
        // Todo only for web
        res.send('Create user test');
    })
    // Create user
    .post(function(req,res){        
        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let email = req.body.email;
        let password = req.body.password;
        let admin =  req.body.admin;
        userModule.userMethods.create(firstName, lastName, email, password, admin).then((user) => {
            console.log(user);
            res.status(200).send(user);
        }, error => {
            console.log("error");
            res.status(400).send(error);
        });
    },error => {
        res.send(err);
    });

router.route('/resetpassword')
    // page
    .get(function(req,res){
        // Todo only for web
        let email = req.body.email;
        let newPassword = req.body.password;
        authModule.authMethods.resetpw(email, newPassword).then(user => {
            console.log("user ", user);
                res.send(user);
        }, error => {
            console.log(error);
            res.send(error);
        });
    });

router.route('/forgot')
    .post(function(req, res){
        let email = req.body.email;
        authModule.authMethods.forgot(email).then(user => {
            res.send("There has been an email send to reset your password!");
        },error => {
            console.log(error);
            res.send(error);
        });
    });
// =====================================
// Login===============================
// =====================================
router.post("/login", function(req, res){
    console.log(req.body);
    authModule.authMethods.login(req.body.email, req.body.password).then((user) => {
        res.send(user);
    },error => {
        console.log("err");
        res.send(error);
    });
});
router.post("/auth", function(req,res){
    const loginToken = req.body.loginToken;
    let user = authModule.authMethods.verifyToken(loginToken);
    if(user){
        res.send(user);
    }else {
        res.send("Not a valid token!");
    }
});
// // =====================================
// // Logout===============================
// // =====================================
// router.get('/logout', function(req, res){
//   req.logout();
//   res.send("u have been logged out");  
// });

module.exports = router;
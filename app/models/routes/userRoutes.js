let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
mongoose.Promise = require("bluebird"); // NOTE: bluebird's promise performance *4
let User   = require('../user'); // get our mongoose model
let userModule = require('../ObjectMethods/userMethods');
let bcrypt = require('bcrypt-nodejs');
let async = require('async');
let crypto = require('crypto');
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
        // let lastName = req.body.lastName;
        // let firstName = req.body.firstName;
        // let email = req.body.email;
        // let password = req.body.password;
        // let admin =  req.body.admin;
        let user = req.body;
        
        userModule.userMethods.create(user).then( (user) => {
            console.log("solved");
            res.status(200).send({
                user: user
            });
        }, error => {
            console.log("error");
            res.status(400).send(error);
        });
    });
router.get('/user?email=:email&password=:password', (req, res) => {
    //Get all users from assignmentMethods
    let id = req.params.id;
    assignmentModule.assignmentMethods.findOneById(id).then(assignment => {
        res.status(200).send(assignment);
    }, error => {
        console.log(error);
        res.status(401).send(error);
    });
});
// =====================================
// Resetpw===============================
// =====================================
router.route('/resetpassword')
    // page
    .get(function(req,res){
        // Todo only for web
        let email = req.body.email;
        let newPassword = req.body.password;
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
        let email = req.body.email;
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
router.post("/authenticate", function(req, res){
    userModule.userMethods.authenticate(req.body).then((token) => {
        res.send(token);
    },error => {
        res.send(error);
    });
});
router.post("/login", function(req,res){
    console.log(req);
    console.log(req.body);

    let user = userModule.userMethods.verifyToken(req.body);
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
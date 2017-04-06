let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
mongoose.Promise = require("bluebird"); // NOTE: bluebird's promise performance *4
let User   = require('../user'); // get our mongoose model
let userModule = require('../ObjectMethods/userMethods');
let authModule = require('../ObjectMethods/authMethods');

let bcrypt = require('bcrypt-nodejs');
let async = require('async');
let crypto = require('crypto');
// =====================================
// All =================================
// =====================================
// router.get('/', function(req, res) {
//     //Get all users from userMethods
//     userModule.userMethods.all().then(users => {
//         res.send(users);
//     }, error => {
//         console.log(error);
//     });
// });
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
        
        userModule.userMethods.create(user).then((user) => {
            console.log("solved");
            res.status(200).send({
                user: user
            });
        }, error => {
            console.log("error");
            res.status(400).send(error);
        });
    });
    router.route('/addmember')
        .post((req,res) => {
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let password = req.body.password;
            let loginToken = req.body.loginToken;
            authModule.authMethods.loginTokenToId(loginToken).then(adminId => {
                console.log("adminId", adminId);
                userModule.userMethods.addMember(adminId, firstName, lastName, email, password).then(user => {
                res.send(user);
                }, err => {
                    console.log(err);
                    res.status(401).send(err);
                });
            },err => {
                res.status(401).send(err);
            });
            

            
        });

    router.get('/', (req, res) => {
    if(!(Object.keys(req.query).length === 0)){
        const id = req.query.id;
        const email = req.query.email;
        if(id){
            userModule.userMethods.findOneById(id).then(user => {
                userModule.userMethods.AllMembers(user.id).then(members => {
                    user = user.toJSON();
                    user.members = members;
                    res.status(200).send(user);
                }, err => {
                    res.send(err);
                });
            }, error => {
                console.log(error);
                res.status(401).send(error);
            });
        }
        else if(email){
            userModule.userMethods.findOne(email).then(user => {
                userModule.userMethods.AllMembers(user.id).then(members => {
                    user.membersIds = null;
                    user = user.toJSON();
                    user.members = members;
                    res.status(200).send(user);
                }, err => {
                    res.send(err);
                });
            },error => {
                res.status(401).send(error);
            }); 
        }
    }    
    else{
        userModule.userMethods.all().then(users => {
            res.send(users);
            }, error => {
                console.log(error);
                res.status(401).send(error);
        });
    }
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
    userModule.userMethods.authenticate(req.body.email, req.body.password).then((user) => {
        res.send(user);
    },error => {
        console.log("err");
        res.send(error);
    });
});
router.post("/login", function(req,res){
    const loginToken = req.body.loginToken;
    let user = userModule.userMethods.verifyToken(loginToken);
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
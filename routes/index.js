var express = require("express");
var router = express.Router();
var mongoose = require('mongoose'); //db connection
var User = require('../user');
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');

router.route('/reset')
    .get(function(req,res){
        var { token } = req.query;
        // '\\..\\..\\..\\views\\noreset.ejs'
        User.findOne({
            'token.body': token
                
        }, (err, user) => {
            if(err){
                return err;
            }            
            else if(user == null){
                res.send("No token found");
            } 
            else if(user.token.endDate > new Date()){
                ejs.renderFile(path.join(__dirname, '../../../views/pages/', 'reset.ejs'), {}, (err,result) => {
                    if(err){
                        res.send(err);
                    }
                    var html = ejs.render(result);
                    res.send(html);
                });
            }
            else {
                //Let user post new pass
                ejs.renderFile(path.join(__dirname, '../../../views/pages/', 'noreset.ejs'), {}, (err,result) => {
                    if(err){
                        res.send(err);
                    }
                    var html = ejs.render(result);
                    res.send(html);
                });                
            }
        });
    })
                    // fs.readFile(path.join(__dirname, '../../../views/pages/', 'noreset.ejs'), 'utf-8', (err, data) => {
                    //     console.log("data: " + data);
                    //     // res.send("ok");
					//     if(err){
                    //         res.send(err);
                    //     }
                    //     var html = ejs.render(data);
                    //     res.send(html);
                    // });
                // }
                // else {
                //     res.render('/pages/noreset', { title: 'Token expired'});
                //     //Let user know his time limit is not valid
                // }

    //     });

    // })
    // Create user
    .post(function(req,res){
        // var password =bcrypt.hashSync(req.body.password);
        var password =req.body.password;
        var token = req.query.token;
        var SALT_FACTOR = 5;
        bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) res.send("oops something went wrong!");

            bcrypt.hash(password, salt, null, function(err, hash) {
                if (err) res.send("oops something went wrong!");
                password = hash;
                User.update(
                {'token.body': token},
                {'password': password, 'token': null}, (err, user) => {
                    if(err) reject(err);
                    console.log("user 2" , user);	
                    res.send("Your password has been succesfully changed!");
                    var user = this;
                });
            });
        });
        
    });
router.route('/status')
    .get((req,res) =>{
        res.send("Healthy");
    });
  

  
        

    // process the login form
    // app.post('/login', do all our passport stuff here);
    
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    /*app.get('/profile', isLoggedIn, function(req, res) {
        
    });*/

    // =====================================
    // LOGOUT ==============================
    // =====================================
    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

// route middleware to make sure a user is logged in
/*function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}*/

module.exports = router;
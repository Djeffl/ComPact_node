const express = require('express');
const router = express.Router();
const paymentModule = require('../objects/payment');
const authenticationService = require("../services/authentication");
const userModule = require("../objects/user/index");
const mongoose = require('mongoose');
const async = require('async');
const token = require('../services/token');

const path = require('path');
//const formidable = require('formidable');
var multer  = require('multer');
var app = express();

// =====================================
// Create===============================
// =====================================

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("ok desti");
    cb(null, './public/uploads/payments')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({storage: storage});

router.post('/', upload.single("attachment"), (req,res, next) => {      
        console.log("Payment create");
        console.log("request body");
        console.log(req.body);
        console.log("req file");
        console.log(req.file);

        const { name = null, description = null, price = null, adminId = null, memberId = null, createdAt = null } = req.body;
        let path = null;
        if (req.file){
            path = req.file.filename;
        }
    
    /**
     * Params = name, description, price, adminId, memberId
     */
    paymentModule.create(name, description, price, adminId, memberId, createdAt, path)
    .then(payment => {
        console.log("Successfully created:");
        console.log(payment);
        res.status(201).send(payment);
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    });
});
// =====================================
// Read=================================
// =====================================
router.get('/', (req, res) => {
    //check Query params
    if(!(Object.keys(req.query).length === 0)){
        const { adminId, loginToken, memberId, id } = req.query;
        //If id get payment itself
        if(id){
            paymentModule.readById(id)
            .then(payment => {
                res.status(200).send(payment);
            })
            .catch(error => {  
                console.log(error);
                res.status(401).send(error);
            });
        }
        //If adminId get all payments of the admin
        else if(adminId){
            paymentModule.readByAdminId(adminId)
            .then(payments => {
                res.status(200).send(payments);
            })
            .catch(error => {
                res.status(401).send(error);
            });
        }
        // ???
        else if(loginToken){
            authenticationService.loginTokenToUser(loginToken)
            .then(user => {
                Assignment.find({adminId : user.id})
                .then(assignment => {
                    res.send(assignment);
                })
                .catch(error => {
                    res.send(error);
                });
            })
            .catch(error => {
                res.send(error);
            });
        }
        //If userId get all payments of user
        else if(memberId) {
            paymentModule.readByUserId(memberId)
            .then(assignments => {
                res.status(200).send(assignments);
            })
            .catch(err => {
                res.status(401).send(err);
            });
        }
        else {
            res.status(404).send("not yet implemented");
        }
    }  
    //No query was given, give all payments back
    //Only for development  
    else{
        paymentModule.read()
        .then(payments => {
            res.send(payments);
        })
        .catch(err => {
            res.status(401).send(err);
        });
    }
});
// =====================================
// Update===============================
// =====================================
router.put('/:id', (req,res) => {
    const { id } = req.params;
    let obj = req.body;
    obj.id = null;
    //Remove all null values
    Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    console.log("obj ", obj);
    paymentModule.update(id, obj)
    .then(payment => {
        console.log("updated: " + payment);
        res.status(200).send(payment);
    })
    .catch(error => {
        res.status(401).send(error);
    });
});
// =====================================
// Delete===============================
// =====================================
router.delete('/:id', (req,res) => {
    const { id } = req.params;
    paymentModule.remove(id)
    .then(response => {
        const data = {
            "success": true
        };
        res.status(200).send(data);
    })
    .catch(error => {
        console.log(error);
        res.status(401).send(error);
    });
});

//REMOVE
router.post('/deleteall', (req,res) => {
    paymentModule.deleteAll()
    .then(response => {
        res.status(200).send(response);

    })
    .catch(error => {
        res.status(401).send(error);
    });
});

module.exports = router;

// GET /assignments
// POS /assignments
// GET /assignments/ID
// PUT /assignments/ID
// DEL /assignments/ID
const express = require('express');
const router = express.Router();
const paymentModule = require('../ObjectMethods/paymentMethods');
const authModule = require("../ObjectMethods/authMethods");
const deviceMethods = require("../ObjectMethods/deviceMethods");
const mongoose = require('mongoose');
const async = require('async');
const token = require('../lib/token');
const Payment = require('../payment');

const path = require('path');
const multer  = require('multer');
const app = express();

// =====================================
// Create===============================
// =====================================
router.post('/',(req, res) => {      
    
    const deviceName = req.body.deviceName;
    const deviceId   = req.body.deviceId;
    const registrationId = req.body.registrationId;

    deviceMethods.create(deviceName,deviceId,registrationId)
    .then(device => {
        console.log("Successfully created:");
        console.log(device);
        res.status(201).send(device);
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
        const adminId = req.query.adminId;
        const loginToken = req.query.loginToken;
        const userId = req.query.memberId;
        const id = req.query.id;

        //If id get payment itself
        if(id){
            paymentModule.paymentMethods.findOneById(id)
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
            paymentModule.paymentMethods.allAdmin(adminId)
            .then(payments => {
                console.log(payments);
                res.status(200).send(payments);
            })
            .catch(error => {
                res.status(401).send(error);
            });
        }
        // ???
        else if(loginToken){
            authModule.authMethods.loginTokenToUser(loginToken)
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
        else if(userId) {
            paymentModule.paymentMethods.findAllUserPayments(userId)
            .then(assignments => {
                console.log(assignments);
                res.status(200).send(assignments);
            })
            .catch(err => {
                res.status(401).send(err);
            });
        }
        else {
            res.send("not implemented");
        }
    }  
    //No query was given, give all payments back
    //Only for development  
    else{
        deviceMethods.get()
        .then((devices) => {
            res.send(devices);
        })
        .catch((err) => {
            res.send(err);
        })
    }
});
// =====================================
// Update===============================
// =====================================
router.put('/:id', (req,res) => {
    const id = req.params.id;
    let obj = req.body;
    obj.id = null;
    //Remove all null values
    Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    console.log("obj ", obj);
    paymentModule.paymentMethods.update(id, obj)
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
    const id = req.params.id;
    paymentModule.paymentMethods.delete(id)
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
    paymentModule.paymentMethods.deleteAll()
    .then(response => {
        res.status(200).send(response);

    })
    .catch(error => {
        console.log(error);
        res.status(401).send(error);
    });
});

module.exports = router;

// GET /assignments
// POS /assignments
// GET /assignments/ID
// PUT /assignments/ID
// DEL /assignments/ID
const express = require('express');
const router = express.Router();
const paymentModule = require('../ObjectMethods/paymentMethods');
const authModule = require("../ObjectMethods/authMethods");
const userModule = require("../ObjectMethods/userMethods");
const mongoose = require('mongoose');
const async = require('async');
const token = require('../lib/token');
const Payment = require('../payment');


// =====================================
// Create===============================
// =====================================
router.post('/', (req,res) => {
        console.log("Payment create");
        console.log("request body");
        console.log(req.body);

        const name = req.body.name || null;
        const description = req.body.description || null;
        const price = req.body.price || null;
        const adminId = req.body.adminId || null;
        const memberId = req.body.memberId || null;
        /**
         * Params = name, description, price, adminId, memberId
         */
        paymentModule.paymentMethods.create(name, description, price, adminId, memberId)
        .then(payment => {
            console.log("Successfully created:")
            console.log(payment);
            res.status(201).send(payment);
        })
        .catch(err => {
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
            .then(assignments => {
                res.status(200).send(assignments);
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
            paymentModule.paymentMethods.findAllUserTasks(userId)
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
        paymentModule.paymentMethods.all()
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
    const id = req.params.id;
    const obj = req.body;
    //Remove all null values
    Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    console.log("obj ", obj);
    assignmentModule.assignmentMethods.update(id, obj)
    .then(assignment => {
        res.status(200).send(assignment);
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
    assignmentModule.assignmentMethods.delete(id)
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
    assignmentModule.assignmentMethods.deleteAll()
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
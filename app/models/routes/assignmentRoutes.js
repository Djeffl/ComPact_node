let express = require('express');
let router = express.Router();
let assignmentModule = require('../ObjectMethods/assignmentMethods');
var authModule = require("../ObjectMethods/authMethods");
let mongoose = require('mongoose');
let async = require('async');
let token = require('../lib/token');
let Assignment = require('../assignment');


// =====================================
// Create===============================
// =====================================
router.route('/create')
    // page
    .get((req,res) =>{
        // Todo only for web
        res.status(200).send('Create test');
    })
    // Create user
    .post((req,res) => {
        const token = req.body.loginToken || null;
        const adminId = null;
        const userId = req.body.userId || null;
        const name = req.body.itemName || null;
        const description = req.body.description || null;

        authModule.authMethods.loginTokenToUser(token)
        .then(user => {
            assignmentModule.assignmentMethods.create(name, description, user.id, userId)
            .then(assignment => {
                res.status(201).send({
                    'assignment': assignment
                });
            })
            .catch(error => {
                    res.status(401).send(error);
                });
        })
        .catch(error => {
            res.status(401).send(error);
        });
    });
// function create(name, description, adminId, userId){
//     assignmentModule.assignmentMethods.create(name, description, adminId, userId)
//         .then(assignment => {
//             console.log("solved");
//             res.status(201).send({
//                 'assignment': assignment
//             });
//         }, error => {
//             console.log("error");
//             console.log(error);
//             res.status(401).send(error);
//         });
// =====================================
// Read=================================
// =====================================
//All
router.get('/', (req, res) => {
    if(!(Object.keys(req.query).length === 0)){
        const adminId = req.query.adminId;
        const loginToken = req.query.loginToken;
        const userId = req.query.userId;
        const id = req.query.id;


        if(id){
            assignmentModule.assignmentMethods.findOneById(id)
            .then(assignment => {
                res.status(200).send(assignment);
            })
            .catch(error => {
                
                console.log(error);
                res.status(401).send(error);
            });
        }
        else if(adminId){
            assignmentModule.assignmentMethods.allAdmin(adminId)
            .then(assignments => {
                res.status(200).send(assignments);
            })
            .catch(error => {
                res.status(401).send(error);
            });
        }
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
        else if(userId) {
            res.status(200).send("not yet implemented");
        }
        else {
            res.status(404).send("not yet implemented");
        }
    }    
    else{
        assignmentModule.assignmentMethods.all()
        .then(assignments => {
            res.send(assignments);
        })
        .catch(error => {
            res.status(401).send(error);
        });
    }
});
// =====================================
// Update===============================
// =====================================
router.put('/update', (req,res) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    assignmentModule.assignmentMethods.update(id, {'name': name, 'description': description})
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
router.post('/delete', (req,res) => {
    const id = req.body.id;
    assignmentModule.assignmentMethods.delete(id)
    .then(response => {
        res.status(200).send(response);

    })
    .catch(error => {
        console.log(error);
        res.status(401).send(error);
    });
});

module.exports = router;
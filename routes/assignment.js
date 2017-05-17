let express = require('express');
let router = express.Router();
let assignmentModule = require('../objects/assignment');
var authenticationService = require("../services/authentication");
var userModule = require("../objects/user");
let mongoose = require('mongoose');
let async = require('async');
let token = require('../services/token');
let Assignment = assignmentModule.object;


// =====================================
// Create===============================
// =====================================
router.route('/')
    // Create user
    .post((req,res) => {
        console.log("Assignments create");
        console.log("req", req.body);
        const token = req.body.loginToken || null;
        const adminId = req.body.adminId || null;
        const memberId = req.body.memberId || null;
        const itemName = req.body.itemName || null;
        const description = req.body.description || null;
        const iconName = req.body.iconName || null;
        // authModule.authMethods.loginTokenToUser(token)
        // .then(user => {
        //     userModule.userMethods.findOne(email).then(member => {
        //         if(member == null){
        //             res.status(401).send("Create assignmentsroutes");
        //         }
                //console.log("member", member);
                assignmentModule.create(itemName, description, iconName, adminId, memberId)
                .then(assignment => {
                    //{
                    //    'assignment': assignment
                    //}
                    res.status(201).send(assignment);
                })
                .catch(error => {
                        res.status(401).send(error);
                });
            // })
        //     .catch(error => {
        //         res.status(401).send(error);
        //     });
        // })
        // .catch(error => {
        //     res.status(401).send(error);
        // });
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
        const userId = req.query.memberId;
        const id = req.query.id;


        if(id){
            assignmentModule.readByUserId(id)
            .then(assignment => {
                res.status(200).send(assignment);
            })
            .catch(error => {
                
                console.log(error);
                res.status(401).send(error);
            });
        }
        else if(adminId){
            assignmentModule.readByAdminId(adminId)
            .then(assignments => {
                res.status(200).send(assignments);
            })
            .catch(error => {
                res.send(error);
            });
        }
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
        else if(userId) {
            assignmentModule.readByUserId(userId)
            .then(assignments => {
                res.status(200).send(assignments);
            })
            .catch(error => {
                res.status(401).send(error);
            });
        }
        else {
            res.status(404).send("not yet implemented");
        }
    }    
    else{
        assignmentModule.readAll()
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
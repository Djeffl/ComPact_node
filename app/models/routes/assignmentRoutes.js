var express = require('express');
var router = express.Router();
var assignmentModule = require('../ObjectMethods/assignmentMethods');
var mongoose = require('mongoose');
var async = require('async');


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
        console.log(req.body);
        let id = req.body.id;
        let name = req.body.name;
        let description = req.body.description;
        
        assignmentModule.assignmentMethods.create({'name': name, 'description': description}).then(assignment => {
            console.log("solved");
            res.status(200).send({
                'assignment': assignment
            });
        }, error => {
            console.log("error");
            res.status(401).send(error);
        });
    });
// =====================================
// Read=================================
// =====================================
//All
router.get('/', (req, res) => {
    //Get function from methods
    assignmentModule.assignmentMethods.all().then(assignments => {
        res.send(assignments);
    }, error => {
        console.log(error);
        res.status(401).send(error);
    });
});
//OneById
router.get('/:id', (req, res) => {
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
// Update===============================
// =====================================
router.put('/update', (req,res) => {
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    assignmentModule.assignmentMethods.update(id, {'name': name, 'description': description}).then(assignment => {
        res.status(200).send(assignment);
    }, error => {
        console.log(error);
        res.status(401).send(error);
    });
});
// =====================================
// Delete===============================
// =====================================
router.post('/delete', (req,res) => {
    let id = req.body.id;
    assignmentModule.assignmentMethods.delete(id).then(response => {
        res.status(200).send(response);

    }, error => {
        console.log(error);
        res.status(401).send(error);
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const deviceModule = require('../objects/device');

const path = require('path');
const app = express();

// =====================================
// Create===============================
// =====================================
router.post('/',(req, res) => {      
    
    const { deviceName, deviceId, registrationId } = req.body; 

    deviceModule.create(deviceName,deviceId,registrationId)
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
        const { adminId, loginToken, userId, id } = req.query;

        //If id get payment itself
        if(id){
            res.send("Not implemented");
        }
        //If adminId get all payments of the admin
        else if(adminId){
            res.send("Not implemented");
        }
        // ???
        else if(loginToken){
            res.send("Not implemented");
        }
        //If userId get all payments of user
        else if(userId) {
            res.send("Not implemented");
        }
        else {
            res.send("Not implemented");
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
    const { id } = req.params;
    let obj = req.body;
    obj.id = null;
    //Remove all null values
    Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    console.log("obj ", obj);
    res.send("Not implemented");
});
// =====================================
// Delete===============================
// =====================================
router.delete('/:id', (req,res) => {
    const { id } = req.params;
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
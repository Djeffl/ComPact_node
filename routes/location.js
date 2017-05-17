const locationModule = require('../objects/location');
const userModule = require('../objects/user');
let express = require('express');
let router = express.Router();
const config = require('../config/constants');
const jsonRequest = require('../services/jsonRequest');

const notification = require('../services/notification');
const user = require('../objects/user');

// =====================================
// Create===============================
// =====================================
router.route('/')
    .post((req,res) => {
        console.log("location create");
        console.log("req", req.body);
        const adminId = req.body.adminId;
        const name = req.body.name;
        const city = req.body.city;
        const streetAndNumber = req.body.streetAndNumber;
        const radius = req.body.radius;
        const latitude = req.body.latitude || 0;
        const longitude = req.body.longitude || 0;
        const membersIds = req.body.membersIds;
        const isGeofence = req.body.isGeofence;
        locationModule.create(adminId, name, city, streetAndNumber, radius, membersIds,latitude, longitude, isGeofence)
        .then(location => {
            res.status(201).send(location);
        })
        .catch(err => {
            console.log(err);
            res.status(401).send(err);
        });
    });
// =====================================
// Read=================================
// =====================================
//All
router.get('/', (req, res) => {
    if(!(Object.keys(req.query).length === 0)){
        const adminId = req.query.adminId;
        const loginToken = req.query.loginToken;
        const userId = req.query.memberId;
        const isGeofence = req.query.isGeofence;

        const id = req.query.id;

        // if(isGeofence != null) {

        //     locationModule.object.find({userId: userId, isGeofence: isGeofence})
        //     .then( locations => {
        //         res.send(locations);
        //     })
        //     .catch(err => {
        //         res.send(err);
        //     });
        // }
        

        if(id) {
            locationModule.object.findOneById(id)
            .then(assignment => {
                res.status(200).send(assignment);
            })
            .catch(error => {
                
                console.log(error);
                res.status(401).send(error);
            });
        }
        else if(adminId){
            locationModule.readByAdminId(adminId)
            .then(locations => {
                console.log(locations);
                res.status(200).send(locations);
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
            locationModule.readByUserId(userId)
            .then(assignments => {
                res.status(200).send(assignments);
            })
            .catch(error => {
                res.status(401).send(error);
            });
        }
        else {
            res.status(404).send("Not yet implemented");
        }
    }    
    else{
        locationModule.readAll()
        .then(locations => {
            res.send(locations);
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
    locationModule.locationMethods.update(id, obj)
    .then(location => {
        res.status(200).send(location);
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
    locationModule.locationMethods.delete(id)
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
    locationModule.locationMethods.deleteAll()
    .then(response => {
        res.status(200).send(response);

    })
    .catch(error => {
        console.log(error);
        res.status(401).send(error);
    });
});

router.post("/current", (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    console.log(req.body);
    console.log(latitude + " " + longitude);
    const memberId = "58f8688afa3bfe02e185b68c";//req.userId;
    locationModule.currentLocation(memberId, latitude, longitude);


    console.log(memberId);

});

router.post('/InsideOutsideLocation', (req,res) => {
    console.log(req.body);
    const memberId = req.body.membersIds[0];
    const locationName = req.body.name;
    const isInsideLocation = req.body.isInLocation;
    console.log("membmer", memberId);

    user.readById(memberId)
    .then( member => {
        var msg;
        if(isInsideLocation){
            msg = member.firstName + " " + member.lastName + " left " + locationName;
        }
        else {
           msg = member.firstName + " " + member.lastName + " entered " + locationName;
        }
         
        console.log("msg ", msg);
        notification.currentLocation(msg, member, ["d-2Gdu1SdI4:APA91bFCRXFisAi3J9fLQIX_BgJe5C_mlhJX3fQMLAG8ILMWJpOF_Kw2lDPw2mlWMfMqfRMRf0XIUcUfNfYz-mJrIchu-GuHAdU42qnh2b9LyDHUwO-fRc8j_540q_0nX_FUeUbTf0TB"],
        (err,devices) => { 
            if(err){
                console.log("error");
                console.log(err);
            }
            console.log("ik zit in de callback");
        });
        console.log("memberrrr FULL", member);
    })
    .catch((err) => {
        console.log(err);
    });
    res.send(req.body);
    
    //notification.currentLocation();
});

module.exports = router;

// GET /assignments
// POS /assignments
// GET /assignments/ID
// PUT /assignments/ID
// DEL /assignments/ID
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
        const { adminId, name, city, streetAndNumber, radius, latitude = 0, longitude = 0, membersIds, isGeofence } = req.body
        
        locationModule.create(adminId, name, city, streetAndNumber, radius, membersIds,latitude, longitude, isGeofence)
        .then(location => {
            console.log("ok");
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
       const { adminId, loginToken, userId, isGeofence, id, memberId } = req.query;

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
        else if(memberId) {
            locationModule.readByUserId(memberId)
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
    const { id } = req.params;
    const obj = req.body;
    //Remove all null values
    Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    console.log("obj ", obj);
    locationModule.update(id, obj)
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
    const { id } = req.params;
    locationModule.delete(id)
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
    locationModule.deleteAll()
    .then(response => {
        res.status(200).send(response);
    })
    .catch(error => {
        console.log(error);
        res.status(401).send(error);
    });
});

router.post("/current", (req, res) => {
    const { latitude, longitude } = req.body
    console.log(req.body);
    console.log(latitude + " " + longitude);
    const memberId = "58f8688afa3bfe02e185b68c";//req.userId;
    locationModule.sendLocation(memberId, latitude, longitude);


    console.log(memberId);

});

router.post('/InsideOutsideLocation', (req,res) => {
    console.log(req.body);
    const memberId = req.body.membersIds[0];
    const locationName = req.body.name;
    const isInsideLocation = req.body.isInLocation;

    user.readById(memberId)
    .then( member => {
        var msg;
        if(isInsideLocation){
            msg = member.firstName + " " + member.lastName + " entered " + locationName;
        }
        else {
           msg = member.firstName + " " + member.lastName + " left " + locationName;
        }

        locationModule.sendGeoLocationUpdate(memberId, msg)
            .then(successMsg => {
                console.log(successMsg);
             })
            .catch(err => {
                console.log("err", err);
            });

        // notification.sendMessage(msg, member, ["dUIfWmp8v6Q:APA91bHbT_8QxL7sNqhwyNTyXCYLhE55ePiqKe9lw__5S903lk_IveHPbB6xExV1EQEbRSzyUUDppFEb1SkrdPZAEpfpLgL48b1t3bcfe-55q7IY1v0X5ess8NzW1IVIM1FP6iLs4D7B"],
        // (err,devices) => {
        //     if(err){
        //         console.log("error");
        //         console.log(err);
        //     }
        //     console.log("ik zit in de callback");
        // });
        // console.log("memberrrr FULL", member);
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
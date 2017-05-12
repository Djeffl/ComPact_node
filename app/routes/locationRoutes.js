const locationModule = require('../objects/location');
const userModule = require('../objects/user');
let express = require('express');
let router = express.Router();
const config = require('../../config/config');
const jsonRequest = require('../services/jsonRequestService');

// =====================================
// Create===============================
// =====================================
router.route('/')
    .post((req,res) => {
        console.log("Assignments create");
        console.log("req", req.body);
        const adminId = req.body.adminId;
        const name = req.body.name;
        const city = req.body.city;
        const streetAndNumber = req.body.streetAndNumber;
        const radius = req.body.radius;
        const membersIds = req.body.membersIds;
        locationModule.create(adminId, name, city, streetAndNumber, radius, membersIds)
        .then(location => {
            res.status(201).send(location);
        })
        .catch(err => {
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
        const id = req.query.id;

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
            assignmentModule.assignmentMethods.findAllUserTasks(userId)
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
        locationModule.locationMethods.all()
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
    const latitude = "51.148759";//req.body.latitude;
    const longitude = "4.435356";//req.body.longitude;
    console.log(req.body);
    console.log(latitude + " " + longitude);
    const memberId = "58f8688afa3bfe02e185b68c";//req.userId;

    console.log(memberId);

});

module.exports = router;

// GET /assignments
// POS /assignments
// GET /assignments/ID
// PUT /assignments/ID
// DEL /assignments/ID
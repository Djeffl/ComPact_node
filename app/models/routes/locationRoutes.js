const locationModule = require('../ObjectMethods/locationMethods');
const userModule = require('../ObjectMethods/userMethods');
let express = require('express');
let router = express.Router();
const config = require('../../../config/config');
const jsonRequest = require('../lib/jsonRequest');

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
        locationModule.locationMethods.create(adminId, name, city, streetAndNumber, radius, membersIds)
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
            locationModule.locationMethods.allAdmin(adminId)
            .then(locations => {
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
            res.status(404).send("not yet implemented");
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
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const memberId = req.userId;
    console.log(memberId);
    userModule.userMethods.FindAdminByMember(memberId)
    .then(admin => {
        console.log(admin);
        console.log("admin found!");
        console.log("okey");
        let options = {
            host: 'maps.googleapis.com',
            port: 443,
            path: '/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + config.googleApiKey,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        jsonRequest.getJSON(options,(statusCode, result) => {
            let locationData = result.results[0].formatted_address.split(',');
            let street = locationData[0];
            let city = locationData[1];
            //let city = locationData[2];

            console.log(admin);
            console.log(admin.id);
            locationModule.locationMethods.create(admin.id, "I Am Here", city, street, null, memberId, latitude, longitude)
            .then( response => {
                res.send(response);
            })
            .catch((err) => {
                res.status(401).send(err);
            });
            
        });
        
    })
    .catch((err) => {
        res.send(err);
    });

});

module.exports = router;

// GET /assignments
// POS /assignments
// GET /assignments/ID
// PUT /assignments/ID
// DEL /assignments/ID
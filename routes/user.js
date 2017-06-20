let express = require('express');
let router = express.Router();

const userModule = require('../objects/user/index');
// let authModule = require('../ObjectMethods/authMethods');
let bcrypt = require('bcrypt-nodejs');
let async = require('async');
let crypto = require('crypto');
let multer = require('multer');
// =====================================
// New =================================
// =====================================
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("ok desti");
    cb(null, './public/uploads/profiles')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({storage: storage});

router.route('/')
// Create user
.post(function(req,res){
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    let email = req.body.email;
    let password = req.body.password;

    userModule.create(firstName, lastName, email, password)
    .then((user) => {
        res.status(200).send({
            user: user
        });
    }, error => {
        res.status(400).send(error);
    });
});
router.route('/addmember')
    .post((req,res) => {
        let { firstName, lastName, email, password,adminId } = req.body;
        if(!adminId) {
            res.status(401).send("adminId obligated");
        }
        // authModule.authMethods.loginTokenToId(loginToken).then(adminId => {
        //     console.log("adminId", adminId);
            userModule.addMember(adminId, firstName, lastName, email, password)
            .then(member => {
            res.send(member);
        })
        .catch(err => {
                res.status(401).send(err);
        });
        // },err => {
        //     res.status(401).send(err);
        // });



    });

router.post('/test', (req, res) => {
    console.log(req.body);
    userModule.readByMemberId(req.body.memberId)
    .then(admin => {
        res.send(admin);
    })
    .catch(err => {
        res.send(err);
    });
});

    router.get('/', (req, res) => {
    if(!(Object.keys(req.query).length === 0)){
        const { id, email, adminId } = req.query;
        if(id){
            userModule.readById(id).then(user => {
                userModule.readMembers(user.id).then(members => {
                    user = user.toJSON();
                    user.members = members;
                    res.status(200).send(user);
                }, err => {
                    res.send(err);
                });
            }, error => {
                console.log("No match found");
                res.status(401).send("No match found");
            });
        }
        else if(adminId){
            userModule.readMembers(adminId)
            .then(members => {
                console.log(members);
                res.send(members);
            })
            .catch(err => {
                res.send({});
            });
        }
        else if(email){
            userModule.readByEmail(email).then(user => {
                userModule.getMembers(user.id).then(members => {
                    user.membersIds = null;
                    user = user.toJSON();
                    user.members = members;
                    res.status(200).send(user);
                }, err => {
                    res.send(err);
                });
            },error => {
                res.status(401).send(error);
            }); 
        }
    }    
    else{
        userModule.readAll().then(users => {
            res.send(users);
            }, error => {
                console.log(error);
                res.status(401).send(error);
        });
    }
});
// =====================================
// Resetpw===============================
// =====================================
router.route('/resetpassword')
    // page
    .get(function(req,res){
        // Todo only for web
        let email = req.body.email;
        let newPassword = req.body.password;
        userModule.userMethods.resetpw(email, newPassword).then(user => {
            console.log("user ", user);
                res.send(user);
        }, error => {
            console.log(error);
            res.send(error);
        });
    });

router.route('/forgot')
    .post(function(req, res){
        let email = req.body.email;
        userModule.userMethods.forgot(email).then(user => {
            res.send("There has been an email send to reset your password!");
        },error => {
            console.log(error);
            res.send(error);
        });
    });
// =====================================
// Login===============================
// =====================================
router.post("/authenticate", function(req, res){
    userModule.userMethods.authenticate(req.body.email, req.body.password).then((user) => {
        res.send(user);
    },error => {
        console.log("err");
        res.send(error);
    });
});
router.post("/login", function(req,res){
    const { loginToken } = req.body;
    let user = userModule.userMethods.verifyToken(loginToken);
    if(user){
        res.send(user);
    }else {
        res.send("Not a valid token!");
    }
});
// // =====================================
// // Logout===============================
// // =====================================
// router.get('/logout', function(req, res){
//   req.logout();
//   res.send("u have been logged out");  
// });
router.put('/:id', upload.single("attachment"), (req, res, next) => {
    const {id} = req.params;
    let obj = req.body;
    //const path = req.file.filename || null;
    //obj.image.path = path;
    obj.id = null;
    //Remove all null values
    Object.keys(obj).forEach(k => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
    console.log("obj ", obj);

    // if(obj.password){
    //         bcrypt.hash(obj.password, null, null, function(err, hash) {
    //         if (err) return next(err);
    //         //obj.password = hash;
    //         });
    // }

    userModule.update(id, obj)
    .then(user => {
        console.log("updated: " + user);
        res.status(200).send(user);
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
    userModule.delete(id)
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

module.exports = router;
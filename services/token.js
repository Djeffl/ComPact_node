let jwt = require('jsonwebtoken');
let secret = require('../config/constants').secret;
let User   = require('../objects/user/object');

module.exports = {
    verify,
    createRefresh,
    createLogin,
}
function derp(){
    console.log("okookoko");
}

function verify(req, res, next){
    const token = req.body.loginToken;
    jwt.verify(token, secret,
    (err, tokenBody) => {
        if(err){
            res.send("Invalid");
        }
        req.userId = tokenBody.id;
        console.log("user", req.userId);
        next();
    });
}

function createRefresh(email) {
    return new Promise((resolve,reject) => {
        jwt.sign({'email': email,'type': 'refresh'}, secret,{
                expiresIn : 100
                },
        (err, token) => {
            if(err){ reject(err);}
            resolve(token);
        });
    });
}

function createLogin(refreshToken){
    return new Promise((resolve, reject) => {
        User.findOne({refreshToken: refreshToken},
        (err, user) => {
            console.log("user ", user);
            if(user == null){
                reject("Internal error: Invalid refreshToken");
            }
            else{
                if(err) { reject(err); }
                else {
                    let idUser = user.id;
                    jwt.sign({ 'id': idUser, 'type': "login"}, secret, {
                        expiresIn : 60*60*24*7 //7 days
                    }, (err, token) =>{
                    if(err){ console.log(error); reject(error); }
                    resolve(token);
                    });
                }
            }

        });
    });
}

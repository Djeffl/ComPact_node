var crypto = require('crypto');

exports.encode = function(payload, secret){
    algorithm = "HS256";

    var header = {
        type:'JWT', 
        alg: algorithm
    };

    var jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));
    // return new Promise((resolve,reject) => {
    //     resolve(jwt + '.' + sign(jwt, secret));
    // });
    return jwt + '.' + sign(jwt, secret);
}

function base64Encode(str){
    return new Buffer(str).toString('base64');
}

function sign(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('base64');
}
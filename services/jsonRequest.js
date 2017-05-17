const http = require("http");
const https = require("https");

module.exports = {
    getJSON
}

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
function getJSON(options, onResult)
{
    console.log("rest::getJSON");

    let prot = options.port == 443 ? https : http;
    let req = prot.request(options, function(res)
    {
        let output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            console.log("output ", output);
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};
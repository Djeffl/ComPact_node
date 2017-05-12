const nodemailer = require("nodemailer");

module.exports = {
    transporter,
    options,
    sendMail
};

// create reusable transporter object using the default SMTP transport
function transporter(service, user, pass){
    const transporter = 
    nodemailer.createTransport({
        service: service,
        auth: {
        user: user,
        pass: pass
        }
    });

    return transporter
}

// setup email data with unicode symbols
function options(from, to, subject, text, html){
    options = {
        from: from, //sender address
        to: to, //list of receivers
        subject: subject, //Subject line
        text: text, //Plain text body
        html: html, //Compile ejs file
        disableUrlAccess: false
    }
    return options;  
};

//Send mail with defined transport object
function sendMail(transporter, mailOptions){
    return new Promise((resolve,reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('this is bad');
                return reject(error);
            }
            console.log("ok we are there");
            return resolve(info);
        });
        
    });	
}

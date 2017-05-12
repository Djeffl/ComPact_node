var mailSystem = require("../objects/mail/index");

module.exports = {
    transporter,
    mailOptions
};

function transporter() {
     return mailSystem.transporter('gmail', 'autoreply.compact.info@gmail.com', 'DitIsGeenWachtwoord1');
}
function mailOptions(email, subject, text, html){
    return mailSystem.options('autoreply.compact.info@gmail.com', email, subject, text, html);
}


const nodemailer = require('nodemailer');
const Mongo = require('../mongo');
const User = Mongo.User;
const crypto = require('crypto');

var sendEmail = function SendOutlookEmail(req, res, next){

    console.log("request body: " + JSON.stringify(req.body));

    User.findOne({email: req.body.sender})
    .then(function(user){
        // Decrypt password 
        console.log("user: " + JSON.stringify(user));
        let cipher = crypto.createDecipher('aes-128-ecb', 'ntu-eee');
        let decrpted = cipher.update(user.password,'hex', 'utf8') + cipher.final('utf8');
        console.log("Decrpted password: " + decrpted);
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com', // Office 365 server
            port: 587,     // secure SMTP
            secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
            auth: {
                user: req.body.sender,
                pass: decrpted
            },
            tls: {ciphers: 'SSLv3'}
        });
    
        let mailOption = {
            from: req.body.sender,
            to: req.body.receiver, // list of receivers
            subject: req.body.subject,
            text: req.body.text,
            // html: req.body.html, // overwrites whatever in text and send as email body to receiver 
            attachments: req.body.attachments,
            // [
            //     {
            //         path: "./tmp/ics/ClassSchedule.ics"
            //     }
            // ]
        };
    
        transporter.sendMail(mailOption, function(err, info){
            if(err){
                console.log("Error: " + JSON.stringify(err));
                res.json({message: "Error Occurred When Sending Email To " + mailOption.to + "\n" + err});
            } else {
                console.log("Email Send: " + JSON.stringify(info));
                res.json({message: "Email Sent Successfully"});
            }
        });

    }).catch(next);
}

module.exports = {
    SendEmail: sendEmail
};
"use strict"

const nodemailer = require('nodemailer')

module.exports = function (to, subject, message) {

    // Set Passive:
    return true

    const mailSettings = {
        service: 'Gmail',
        auth: {
            user: 'atesr782@gmail.com',
            pass: 'kxjl wxfi huvw hiqb'
          }
    }

    // Connect to mailServer:
    const transporter = nodemailer.createTransport({
        service: mailSettings.service,
        auth: {
            user: mailSettings.user,
            pass: mailSettings.pass,
        }
    })
    // SendMail:
    transporter.sendMail({
        from: mailSettings.auth.user,
        to: to,
        subject: subject,
        text: message,
        html: message,
    }, (error, info) => {
        error ? console.log(error) : console.log(info)
    })
}
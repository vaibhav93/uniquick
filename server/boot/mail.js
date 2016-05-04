'use strict';
var nodemailer = require('nodemailer');
module.exports = function(app) {
    app.transporter = {};
    app.transporter.billing = nodemailer.createTransport({
        service: 'Zoho',
        secure: true,
        auth: {
            user: 'billing@uniquicksolutions.com',
            pass: 'uniquick@123'
        }
    });
}
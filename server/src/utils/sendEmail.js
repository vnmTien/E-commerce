const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async ( email, html ) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"E-commerce" <no-reply@e-commerce.com>', // sender address
        to: email, // list of receivers
        subject: "Forgot Password", // Subject line
        // text: "Hello world?", // plain text body
        html: html, // html body
    });

    return info;
})

module.exports = sendEmail;
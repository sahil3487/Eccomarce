//const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//     const transporter = nodeMailer.createTransport({
//         host: process.env.SMPT_HOST,
//         port: process.env.SMPT_PORT,
//         service: process.env.SMPT_SERVICE,
//         auth: {
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMPT_MAIL,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//     };

//     await transporter.sendMail(mailOptions);
// };
const nodemailer = require("nodemailer");

const sendEmail = async(mailOptions) => {

let transporter = nodemailer.createTransport({
            service: process.env.SMPT_MAIL,
            port:process.env.SMPT_PORT ,
            secure: true,
            secureConnection: false,
            auth: {
                user: process.env.SMPT_MAIL,
                pass:process.env.SMPT_PASSWORD 
            },
            tls:{
                rejectUnAuthorized:true
            }
});

let info = await transporter.sendMail(mailOptions);
console.log(`Message Sent: ${info.messageId}`);
}

module.exports = sendEmail;
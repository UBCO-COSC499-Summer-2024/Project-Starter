const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2a79d923c4769b",
      pass: "269495bfbe86a4"
    }
  });

const sendPasswordResetEmail = (to, token) => {
    const mailOptions = {
        from: '"GradeIT OMR" <no-reply@gradeit.com>',
        to,
        subject: 'Password Reset',
        text: 'This is a test email from your Node.js application',
        html: `<p>You requested for a password reset</p>
               <p>Click this <a href="${process.env.CLIENT_URL}/reset-password/${token}">link</a> to reset your password</p>`
    };
    
    return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Error sending email');
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendPasswordResetEmail };
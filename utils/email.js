const nodemailer = require('nodemailer');

const sendEmail = options => {
  // 1) Create a transporter instance
  const transporter = nodemailer.createTransporter({
    service: 'Gmail',
  });
  // 2) Define the email options
  // 3) Actually send the email
};

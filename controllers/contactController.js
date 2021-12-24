const nodemailer = require('nodemailer');
const factory = require('./handlerFactory');
const Contact = require('../models/contactModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllContacts = factory.getAll(Contact);

exports.createContact = catchAsync(async (req, res, next) => {
  const doc = await Contact.create(req.body);

  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

  transporter.sendMail({
    from: `👻👻👻👻👻 <${process.env.EMAIL_FROM}>`, // sender address
    to: `${process.env.EMAIL_TO}`, // list of receivers
    subject: 'You got a new contact request', // Subject line
    text: JSON.stringify(doc), // plain text body
    html: JSON.stringify(doc), // html body
  });

  transporter.sendMail({
    from: `Vladyslav Nikiforov <${process.env.EMAIL_FROM}>`, // sender address
    to: `${doc.email}`, // list of receivers
    subject: 'Your contact was successfully submited', // Subject line
    text: 'I will get back to you ASAP', // plain text body
    html: `<h1>Hello ${doc.name}!</h2>
    <h2>Thanks for contacting me!<h2>
    <p>I will get to you ASAP :)</p>
    `, // html body
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

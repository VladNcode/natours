const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  topic: {
    type: String,
  },
  subject: {
    type: String,
  },
});

const Contact = mongoose.model('Booking', contactSchema);

module.exports = Contact;

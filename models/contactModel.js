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

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

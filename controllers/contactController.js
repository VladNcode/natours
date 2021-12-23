const factory = require('./handlerFactory');
const Contact = require('../models/contactModel');

exports.getAllContacts = factory.getAll(Contact);
exports.createContact = factory.createOne(Contact);

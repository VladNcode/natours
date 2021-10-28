const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 12;

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password.'],
    maxlength: [8, 'A password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // This only works on CREATE AND SAVE!!!
      validator: function (val) {
        return val === this.password; // if false = validation error
      },
      message: "Passwords doesn't match",
    },
  },
  passwordChangedAt: Date,
});

// Password encryption
usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordConfirm = undefined;
    return next();
  } catch (err) {
    return next(err);
  }
});

// Pass validation
usersSchema.methods.validatePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// user pass changed?
usersSchema.methods.changedPasswordAfter = function (JTWTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JTWTimeStamp < changedTimeStamp; // 100 < 200 = true
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', usersSchema);

module.exports = User;

const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 60 * 1000;

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
    minlength: [8, 'A password must be at least 8 characters'],
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: Number,
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

usersSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

usersSchema.pre(/^find/, function (next) {
  // this poinst to the current query
  this.find({ active: { $ne: false } });
  next();
});

//! Maximum login attempts
usersSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

usersSchema.methods.incrementLoginAttempts = function (callback) {
  console.log('lock until', this.lockUntil);
  // if we have a previous lock that has expired, restart at 1
  const lockExpired = !!(this.lockUntil && this.lockUntil < Date.now());
  console.log('lockExpired', lockExpired);
  if (lockExpired) {
    return this.update(
      {
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      },
      callback
    );
  }
  // otherwise we're incrementing
  const updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  const needToLock = !!(
    this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked
  );
  console.log('needToLock', needToLock);
  console.log('loginAttempts', this.loginAttempts);
  if (needToLock) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    console.log('LOCK_TIME', Date.now() + LOCK_TIME);
  }
  //console.log("lockUntil",this.lockUntil)
  return this.update(updates, callback);
};

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

usersSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', usersSchema);

module.exports = User;

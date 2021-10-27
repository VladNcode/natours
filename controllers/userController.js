const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//! Fake users features
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();

  //! Send response
  res.status(200).json({
    status: 'success',
    results: allUsers.length,
    data: {
      users: allUsers,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
exports.getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

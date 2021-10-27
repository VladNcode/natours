const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  //   if (!newUser) {
  //     return next(new AppError('No user found with that ID', 404));
  //   }

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

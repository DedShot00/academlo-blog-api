const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: `user with id ${id} not found`,
    });
  }
  req.user = user;
  next();
});

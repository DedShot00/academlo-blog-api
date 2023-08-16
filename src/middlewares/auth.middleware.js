const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, res, next) => {
  //todo Extract token from headers and assign it to 'token' variable
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //todo send an error if token doesn't exist
  if (!token) {
    return next(
      new AppError('you are not logged in!, please log in to continue', 401)
    );
  }

  //todo Decode token with jwt
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  //todo search and validate if user exists
  const user = await User.findOne({
    where: {
      id: decodedToken.id,
    },
  });

  if (!user) {
    return next(new AppError('the token owner is not active', 401));
  }

  //todo verify if token was generated after a password change
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(user.passwordChangedAt.getTime() / 1000);

    if (decodedToken.iat < changedTimeStamp) {
      return next(
        new AppError('There are changes on the account please login again', 401)
      );
    }
  }

  //todo add active session user to req
  req.currentUser = user;

  next();
});

exports.protectAccountOwner = (req, res, next) => {
  const { user, currentUser } = req;

  if (user.id !== currentUser.id) {
    return next(new AppError("You don't own this account", 401));
  }

  next();
};

exports.protectPostOwner = (req, res, next) => { 
  const {currentUser, post} = req

  if (currentUser.id !== post.userId){
    return next(new AppError("You don't own this post",401))
  }
  
  next()
}

exports.restrictTo = (...roles) => { 
  return (req, res, next) => { 
    console.log(roles)
    if (!roles.includes(req.currentUser.role)) {
      return next(new AppError("You don't have the necessary permissions",403))
    }
    next()
  }
}
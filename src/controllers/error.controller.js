const Error = require('../models/error.model');
const AppError = require('../utils/appError');

const handleCastError22001 = () =>
  new AppError('Characters quantity greater than expected', 400);

const handleCastError22P02 = () =>
  new AppError('Invalid datatype in database', 400);

const handleCastError23505 = () =>
  new AppError('Duplicated field value, please use another value', 400);

const handleJwtErr = () =>
  new AppError('Invalid token, please login again', 401);

const handleExpiredTokenErr = () =>
  new AppError('Session expired, please login again', 401);

const sendErrorDev = (err, res) => {
  Error.create({
    status: err.status,
    message: err.message,
    stack: err.stack
  })

  console.log(err);
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendErrorProd = (err, res) => {
  console.log(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: 'fail',
      message: 'internal server error',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;

    if (err.parent?.code === '22001') error = handleCastError22001();
    if (err.parent?.code === '22P02') error = handleCastError22P02();
    if (err.parent?.code === '23505') error = handleCastError23505();
    if (err.name === 'JsonWebTokenError') error = handleJwtErr();
    if (err.name === 'TokenExpiredError') error = handleExpiredTokenErr();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;

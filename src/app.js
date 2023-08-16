const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const sanitize = require('perfect-express-sanitizer');
//
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

//* routes
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');
const commentRoutes = require('./routes/comment.route');

const app = express();
const limiter = rateLimit({
  max: 5,
  windowMs: 1000 * 5 * 60,
  message: 'Too many requests, try again in 5 minutes',
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(
  sanitize.clean({
    xss: true,
    noSql: true,
    sql: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log(process.env.NODE_ENV);

app.use('/api/v1/', limiter);
//* routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`cant find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;

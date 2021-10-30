const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//! 1) Global Middlewares

//* Set security HTTP headers
app.use(helmet());

//* Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} // GET /api/v1/tours 200 2.154 ms - 8944

//* Limit requests from same IP
const limiter = rateLimit({
  max: 100, // requests from the same ip
  windowMs: 60 * 60 * 1000, // 1
  message: 'Too many requests from this ip, please try again in an hour!',
});
app.use('/api/', limiter);

//* Body parser, reading from body into req.body
app.use(express.json({ limit: '10kb' }));

//* Data sanitization againts NoSQL query injection
app.use(mongoSanitize());

//* Data sanitization againts XSS
app.use(xss());

//* Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//* Serving static files
app.use(express.static(`${__dirname}/public`)); // 3000/public/overview.html === 3000/overview.html

//* Test middleware
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//! 2) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//* If code reaches this point, it will be executed
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

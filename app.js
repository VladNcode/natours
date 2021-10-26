const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//* 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} // GET /api/v1/tours 200 2.154 ms - 8944
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // 3000/public/overview.html === 3000/overview.html

// !Middleware to show current date and time
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

//* 2) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//* If code reaches this point, it will be executed
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//* 1) Middlewares
app.use(morgan('dev')); // GET /api/v1/tours 200 2.154 ms - 8944
app.use(express.json());

// !Middleware to show current date and time
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

//* 3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

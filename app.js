const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

//* 1) Middlewares
app.use(morgan('dev')); // GET /api/v1/tours 200 2.154 ms - 8944
app.use(express.json());

// !Applies to each and every single request because route isn't specified
// app.use((req, res, next) => {
//   console.log('Hello from the middleware!');
//   next();
// });

// !Middleware to show current date and time
app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

// !Required
// app.get('/api/v1/tours/:id/:x/:y', (req, res) => {})
// console.log(req.params); // {id: '5', x:'23', y:'45'}
// !Optional
// app.get('/api/v1/tours/:id/:x?/:y?', (req, res) => {})
// console.log(req.params); // {id: '5', x:'23', y:'45'}

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//* 2) Route handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.time,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[req.params.id - 1],
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  });
};

const changeTour = (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  tours[req.params.id] = Object.assign({ id: req.params.id * 1 }, req.body);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {});

  res.status(200).json({
    status: 'success',
    message: 'tour updated',
    data: {
      tour: tours[req.params.id],
    },
  });
};
const deleteTour = (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  tours.splice(req.params.id - 1, 1);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {});

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//! Fake users features
const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
const createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
const getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
const updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
const deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

//* 3) Routes

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', changeTour);
// app.delete('/api/v1/tours/:id', deleteTour);

const tourRouter = express.Router();
const userRouter = express.Router();

//! '/' === '/api/v1/tours'
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(changeTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//* 4) Start the server
const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

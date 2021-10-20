const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// !Required
// app.get('/api/v1/tours/:id/:x/:y', (req, res) => {})
// console.log(req.params); // {id: '5', x:'23', y:'45'}
// !Optional
// app.get('/api/v1/tours/:id/:x?/:y?', (req, res) => {})
// console.log(req.params); // {id: '5', x:'23', y:'45'}

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', changeTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(changeTour).delete(deleteTour);

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

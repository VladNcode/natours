const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Listening on port ${port}', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can send to this endpoint...');
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

// !Required
// app.get('/api/v1/tours/:id/:x/:y', (req, res) => {})
// console.log(req.params); // {id: '5', x:'23', y:'45'}
// !Optional
// app.get('/api/v1/tours/:id/:x?/:y?', (req, res) => {})
// console.log(req.params); // {id: '5', x:'23', y:'45'}

app.get('/api/v1/tours/:id/:x?', (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[req.params.id],
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  newId = tours[tours.length - 1].id + 1;
  newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  });
});

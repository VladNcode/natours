const express = require('express');
const app = express();
const port = 3000;

app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Listening on port ${port}', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can send to this endpoint...');
});

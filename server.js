const app = require('./app');

//* 4) Start the server
const port = 3000;
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

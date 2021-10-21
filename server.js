const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(app.get('env'));
// console.log(process.env);

//* 4) Start the server
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection established');
  });

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name.'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price.'],
  },
});

const Tour = mongoose.model('Tour', toursSchema);

// console.log(app.get('env'))
// console.log(process.env)
//* 4) Start the server
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});

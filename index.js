const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();

app.use(express.json());

const authRoute = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to DB ...')
}).catch((error) => {
  console.log(error);
});

app.use('/api/auth', authRoute);


app.listen(3001, () => {
  console.log('Server is Listening on Port 3001 ...');
});
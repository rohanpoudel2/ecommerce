const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to DB ...')
}).catch((error) => {
  console.log(error);
});

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);


app.listen(3001, () => {
  console.log('Server is Listening on Port 3001 ...');
});
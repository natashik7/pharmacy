const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const priceRouter = require('./routes/priceRouter');
const authRouter = require('./routes/authRouter');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/prices', priceRouter);
app.use('/api/auth', authRouter);

module.exports = app;

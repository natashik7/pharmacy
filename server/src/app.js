const express = require('express'); 
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan'); 
const priceRouter = require('./routes/priceRouter');

const app = express(); 
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use('/api/price', priceRouter)

module.exports = app;
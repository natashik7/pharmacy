const cookieParser = require('cookie-parser'); 
const morgan = require('morgan'); 
const express = require("express");
const db = require("../db/models"); 
const priceRouter = require('./routes/priceRouter');
const supplierRouter = require("./routes/supplierRouter"); 
const authRouter = require('./routes/authRouter');
require('./helpers/scheduler'); // Импортируем планировщик

const app = express();

app.use(express.json());
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use('/api/prices', priceRouter);
app.use('/api/auth', authRouter);

module.exports = app;
const express = require('express');
// const cookieParser = require('cookie-parser'); При написании реги разкоментить 
const suppliersRouter = require('./routes/suppliersRouter.js');
const morgan = require('morgan');


const app = express();

// Мидлвары
app.use(express.json());
app.use(morgan('dev'));

// Роутинги
app.use('/api/suppliers', suppliersRouter);

module.exports = app;

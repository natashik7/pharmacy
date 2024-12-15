const cookieParser = require('cookie-parser'); 
const morgan = require('morgan'); 
const express = require("express");
const db = require("../db/models"); 
const priceRouter = require('./routes/priceRouter');
const supplierRouter = require("./routes/supplierRouter"); 
const authRouter = require('./routes/authRouter');
const fetchFilesFromFTP = require('./utils/fetchFileFromFTP');
const cron = require('node-cron');


const app = express();


app.use(express.json());

app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());



let isRunning = false;

cron.schedule('* * * * *', async () => {
  if (isRunning) return; // Если уже выполняется, выходим
  isRunning = true; // Устанавливаем флаг

  try {
    await fetchFilesFromFTP();
  } catch (error) {
    console.error('Ошибка в планировщике:', error);
  } finally {
    isRunning = false; // Сбрасываем флаг после завершения
  }
});
// Настройка планировщика задач

app.use('/api/prices', priceRouter);
app.use('/api/auth', authRouter);


  module.exports = app;
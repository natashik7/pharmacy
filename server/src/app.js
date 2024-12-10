const cookieParser = require('cookie-parser'); 
const morgan = require('morgan'); 
const express = require("express");
const db = require("./models"); 
const priceRouter = require('./routes/priceRouter');
const supplierRouter = require("./routes/supplierRouter"); 
const { initializeSchedules } = require("./services/scheduleService"); 

const app = express();
const PORT = 3000;


app.use(express.json());

app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/api/price', priceRouter)
app.use("/suppliers", supplierRouter);


db.sequelize
  .authenticate() 
  .then(() => {
    console.log("Database connection established successfully.");

   
    return db.sequelize.sync(); 
  })
  .then(() => {
    console.log("Database synchronized.");

 
    initializeSchedules();

    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

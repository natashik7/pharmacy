require('dotenv').config(); 
module.exports = { 
  development: { 
    username: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME, 
    host: process.env.DB_HOST, 
    dialect: 'postgres', 
    seederStorage: 'sequelize', 
    seederStorageTableName: 'SequelizeData' 
  }, 
  test: { 
    username: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME, 
    host: process.env.DB_HOST, 
    dialect: 'postgres', 
    seederStorage: 'sequelize', 
    seederStorageTableName: 'SequelizeData' 
  }, 
  production: { 
    username: process.env.POSTGRES_USER, 
    password: process.env.POSTGRES_PASSWORD, 
    database: process.env.POSTGRES_DB, 
    host: process.env.DB_HOST_PROD, 
    dialect: 'postgres', 
    seederStorage: 'sequelize', 
    seederStorageTableName: 'SequelizeData' 
  }, 
}; 
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Price.init({
    counter_agent_id: DataTypes.INTEGER,
    price_date: DataTypes.DATE,
    full_name: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    barcode: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};
'use strict';

const { Model } = require('sequelize');
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
  Price.init(
    {
      supplier_id: DataTypes.INTEGER,
      price_date: DataTypes.DATE,
      product_name: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      barcode: DataTypes.STRING,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Price',
    },
  );
  return Price;
};

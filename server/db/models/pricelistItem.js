const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PricelistItem extends Model {
    static associate({ Pricelist }) {
     
      PricelistItem.belongsTo(Pricelist, {
        foreignKey: 'pricelistId',
        as: 'pricelist',
      });
    }
  }

  PricelistItem.init(
    {
      id: {
        type: DataTypes.UUID,           
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pricelistId: {
        type: DataTypes.UUID,           
        allowNull: false,
      },
      manufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      series: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize, 
      tableName: 'PricelistItem',
      timestamps: true,
    }
  );

  return PricelistItem;
};

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pricelist extends Model {
    static associate({PricelistItem}) {
      Pricelist.hasMany(PricelistItem, {
        foreignKey: 'pricelistId',
        as: 'items',
      });
    }
  }

  Pricelist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      priceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize, 
      tableName: 'Pricelist',
      timestamps: true, 
    }
  );

  return Pricelist;
};

'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init(
    {
      id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true, 
      },
      short_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true, // Валидация email
        },
        allowNull: true,
      },
      ftp_host: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ftp_user: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ftp_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ftp_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      schedule: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'Suppliers', 
      timestamps: true, // Включаем поля createdAt и updatedAt
    },
  );
  return Supplier;
};

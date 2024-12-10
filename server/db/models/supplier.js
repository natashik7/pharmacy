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
      short_name: DataTypes.STRING,
      full_name: DataTypes.STRING,
      region: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      ftp_host: DataTypes.STRING,
      ftp_user: DataTypes.STRING,
      ftp_password: DataTypes.STRING,
      ftp_path: DataTypes.STRING,
      schedule: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Supplier',
    },
  );
  return Supplier;
};

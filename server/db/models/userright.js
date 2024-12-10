'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRight.init(
    {
      userId: DataTypes.INTEGER,
      rightId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserRight',
    },
  );
  return UserRight;
};

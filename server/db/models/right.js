'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Right extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsToMany(User, {
        through: 'userRightes',
        foreignKey: 'rightId',
        otherKey: 'userId',
        as: 'role',
        
      });
    }
    }
  
  Right.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Right',
    },
  );
  return Right;
};

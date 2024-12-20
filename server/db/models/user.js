'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Right, UserRight }) {
      this.belongsToMany(Right, {
        through: UserRight, 
        foreignKey: 'userId', 
        otherKey: 'rightId',  
        as: 'rights', 
        onDelete: 'CASCADE', 
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true, 
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
          isEmail: true, 
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true, 
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};

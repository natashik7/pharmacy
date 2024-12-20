'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PricelistItem', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      pricelistId: {
        type: Sequelize.UUID,        
        allowNull: false,
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      series: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expirationDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PricelistItem');
  },
};

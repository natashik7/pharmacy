'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      short_name: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      ftp_host: {
        type: Sequelize.STRING
      },
      ftp_user: {
        type: Sequelize.STRING
      },
      ftp_password: {
        type: Sequelize.STRING
      },
      ftp_path: {
        type: Sequelize.STRING
      },
      schedule: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Suppliers');
  }
};
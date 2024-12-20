'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin',
          fullname: 'admin',
          rights: 'admin',
          password: await bcrypt.hash('123', 10),
          email: 'Ivanov@Ivan.ru',
          phone: '+7(999)999-99-99',
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

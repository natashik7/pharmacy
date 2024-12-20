'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');  // Импортируем функцию для генерации UUID

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: uuidv4(),  // Генерируем UUID с помощью библиотеки uuid
          username: 'admin',
          fullname: 'admin',
          rights: 'admin',
          password: await bcrypt.hash('123', 10),
          email: 'Ivanov@Ivan.ru',
          phone: '+7(999)999-99-99',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

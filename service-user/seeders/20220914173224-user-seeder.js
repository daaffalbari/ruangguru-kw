'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Daffa Albari',
        profession: 'Web Developer',
        role: 'admin',
        email: 'daffa@mail.com',
        password: await bcrypt.hash('daffaganteng123', 10),
        create_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Rizki',
        profession: 'Web Designer',
        role: 'student',
        email: 'rizki@mail.com',
        password: await bcrypt.hash('rizki123', 10),
        create_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};

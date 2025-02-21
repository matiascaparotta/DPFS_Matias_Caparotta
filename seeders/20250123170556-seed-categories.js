'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        name_category: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_category: 'Books',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_category: 'Clothing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
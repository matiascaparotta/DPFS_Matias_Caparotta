'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Carts', [
      {
        user_id: 1, 
        total_price: 719.98,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2, 
        total_price: 19.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {});
  },
};
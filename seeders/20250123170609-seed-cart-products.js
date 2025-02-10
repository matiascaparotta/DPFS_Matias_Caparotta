'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Cart_Products', [
      {
        cart_id: 1, 
        product_id: 1, 
        quantity: 1,
        cart_price: 699.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cart_id: 1, 
        product_id: 3, 
        quantity: 1,
        cart_price: 19.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cart_id: 2, 
        product_id: 3, 
        quantity: 1,
        cart_price: 19.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cart_Products', null, {});
  },
};
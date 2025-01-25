'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        product_name: 'Smartphone',
        description: 'A high-end smartphone with a great camera.',
        price: 699.99,
        product_image: 'https://via.placeholder.com/150',
        category_id: 1, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'Laptop',
        description: 'A powerful laptop for work and gaming.',
        price: 1299.99,
        product_image: 'https://via.placeholder.com/150',
        category_id: 1, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'Novel',
        description: 'A thrilling novel to keep you entertained.',
        price: 19.99,
        product_image: 'https://via.placeholder.com/150',
        category_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  },
};
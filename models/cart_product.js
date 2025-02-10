'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart_Product = sequelize.define('Cart_Product', {
    cart_productId: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true, 
    },
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    cart_price: DataTypes.DECIMAL,
  }, {});

  Cart_Product.associate = function(models) {
    Cart_Product.belongsTo(models.Cart, { foreignKey: 'cart_id' });
    Cart_Product.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Cart_Product;
};
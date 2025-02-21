'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true, 
    },
    user_id: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
  }, {});

  Cart.associate = function(models) {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.belongsToMany(models.Product, {
      through: models.Cart_Product,
      foreignKey: 'cart_id',
    });
  };

  return Cart;
};
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productId: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    product_image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'default.png',
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'categoryId', 
      },
    },
  }, {
    timestamps: false, 
    tableName: 'Products', 
  });

  
  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });  };

  return Product;
};


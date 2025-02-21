'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryId: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, 
    tableName: 'Categories', 
  });

  
  Category.associate = function(models) {
  
    Category.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });  };

  return Category;
};
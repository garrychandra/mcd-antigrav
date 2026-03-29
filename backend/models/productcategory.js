'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      ProductCategory.belongsTo(models.Product, { foreignKey: 'product_id' });
      ProductCategory.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }
  ProductCategory.init({
    product_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductCategory',
  });
  return ProductCategory;
};

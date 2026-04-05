const Sequelize = require('sequelize');
const shortId = require('shortid');
const authUtils = require('../../utils/auth');

const product = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  memberId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  productId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('path');
      if (!value) return null;
      return authUtils.getCompleteUrl(value);
    }
  },
  isFeatured: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const productImageSchema = sequelize.define('ProductImage', product, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = productImageSchema;

const productSchema = require('../product/schema');
const memberSchema = require('../member/schema');

productImageSchema.belongsTo(productSchema, {
  foreignKey: 'productId',
  as: 'product',
  targetKey: 'id'
});

productImageSchema.belongsTo(memberSchema, {
  foreignKey: 'memberId',
  as: 'member',
  targetKey: 'id'
});

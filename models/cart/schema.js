const Sequelize = require('sequelize');
const shortId = require('shortid');

const cart = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  memberId: { type: Sequelize.STRING, allowNull: false },
  productId: { type: Sequelize.STRING, allowNull: false },
  categoryId: { type: Sequelize.STRING, allowNull: false },
  quantity: { type: Sequelize.INTEGER, allowNull: false },
  amount: { type: Sequelize.INTEGER, allowNull: false },
  status: { type: Sequelize.BOOLEAN, defaultValue: true },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
};

const cartSchema = sequelize.define('Cart', cart, {
  freezeTableName: true
});

module.exports = cartSchema;

const productSchema = require('../product/schema');
const memberSchema = require('../member/schema');
const categorySchema = require('../category/schema');

cartSchema.belongsTo(productSchema, {
  as: 'product',
  foreignKey: 'productId',
  sourceKey: 'id'
});

cartSchema.belongsTo(memberSchema, {
  as: 'member',
  foreignKey: 'memberId',
  sourceKey: 'id'
});

cartSchema.belongsTo(categorySchema, {
  as: 'category',
  foreignKey: 'categoryId',
  sourceKey: 'id'
});

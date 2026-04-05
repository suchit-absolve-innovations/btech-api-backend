const Sequelize = require('sequelize');
const shortId = require('shortid');

const like = {
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
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const productLikeSchema = sequelize.define('ProductLike', like, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = productLikeSchema;

const productSchema = require('../product/schema');
const memberSchema = require('../member/schema');

productLikeSchema.belongsTo(productSchema, {
  foreignKey: 'productId',
  as: 'product',
  targetKey: 'id'
});

productLikeSchema.belongsTo(memberSchema, {
  foreignKey: 'memberId',
  as: 'member',
  targetKey: 'id'
});

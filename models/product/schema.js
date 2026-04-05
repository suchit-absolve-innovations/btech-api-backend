const Sequelize = require('sequelize');
const shortId = require('shortid');
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
  sellerId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  categoryId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: { type: Sequelize.STRING, allowNull: false },
  price: { type: Sequelize.FLOAT, allowNull: false },
  additionalDescription: { type: Sequelize.TEXT('long') },
  salePrice: { type: Sequelize.FLOAT, allowNull: false },
  discount: { type: Sequelize.FLOAT },
  isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
  info: { type: Sequelize.JSON, allowNull: false },
  totalLike: {
    type: Sequelize.BIGINT,
    defaultValue: 0,
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

const productSchema = sequelize.define('Product', product, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = productSchema;

const userSchema = require('../member/schema');
const categorySchema = require('../category/schema');
const productImageSchema = require('../productImage/schema');
const productLikeSchema = require('../productLike/schema');

// Member Association
productSchema.belongsTo(userSchema, {
  foreignKey: 'memberId',
  targetKey: 'id',
  as: 'owner'
});

// Member Association
productSchema.belongsTo(userSchema, {
  foreignKey: 'sellerId',
  targetKey: 'id',
  as: 'seller'
});

// Category Association
productSchema.belongsTo(categorySchema, {
  foreignKey: 'categoryId',
  targetKey: 'id',
  as: 'category'
});

// Product image Association
productSchema.hasMany(productImageSchema, {
  as: 'images',
  foreignKey: 'productId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

// Product Like Association
productSchema.hasMany(productLikeSchema, {
  as: 'likes',
  foreignKey: 'productId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

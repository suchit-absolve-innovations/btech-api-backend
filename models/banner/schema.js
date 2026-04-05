const Sequelize = require('sequelize');
const shortId = require('shortid');
const authUtils = require('../../utils/auth');

const banner = {
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
  name: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  categoryId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  productId: {
    type: Sequelize.STRING,
    allowNull: true
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
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const bannerSchema = sequelize.define('Banner', banner, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = bannerSchema;

const categorySchema = require('../category/schema');
const productSchema = require('../product/schema');
const memberSchema = require('../member/schema');

bannerSchema.belongsTo(categorySchema, {
  foreignKey: 'categoryId',
  as: 'category',
  targetKey: 'id'
});

bannerSchema.belongsTo(productSchema, {
  foreignKey: 'productId',
  as: 'product',
  targetKey: 'id'
});
bannerSchema.belongsTo(memberSchema, {
  foreignKey: 'memberId',
  as: 'member',
  targetKey: 'id'
});

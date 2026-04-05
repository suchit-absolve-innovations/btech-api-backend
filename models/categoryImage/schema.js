const Sequelize = require('sequelize');
const shortId = require('shortid');
const authUtils = require('../../utils/auth');

const category = {
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
  categoryId: {
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
    defaultValue: false
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

const categoryImageSchema = sequelize.define('CategoryImage', category, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = categoryImageSchema;

const categorySchema = require('../category/schema');
const memberSchema = require('../member/schema');

categoryImageSchema.belongsTo(categorySchema, {
  foreignKey: 'categoryId',
  as: 'category',
  targetKey: 'id'
});

categoryImageSchema.belongsTo(memberSchema, {
  foreignKey: 'memberId',
  as: 'member',
  targetKey: 'id'
});

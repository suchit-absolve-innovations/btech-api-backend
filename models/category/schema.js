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
  name: { type: Sequelize.STRING, allowNull: false },
  type: { type: Sequelize.STRING, allowNull: false },
  logo: {
    type: Sequelize.STRING,
    allowNull: true,
    get() {
      const value = this.getDataValue('logo');
      if (!value) return null;
      return authUtils.getCompleteUrl(value);
    }
  },
  status: { type: Sequelize.BOOLEAN, defaultValue: true },
  isNavigation: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
};

const categorySchema = sequelize.define('Category', category, {
  freezeTableName: true
});

module.exports = categorySchema;

const categoryImageSchema = require('../categoryImage/schema');
const categoryCouponMappingSchema = require('../categoryCouponMapping/schema');

categorySchema.hasMany(categoryImageSchema, {
  as: 'images',
  foreignKey: 'categoryId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

categorySchema.hasMany(categoryCouponMappingSchema, {
  as: 'categoryCouponMapping',
  foreignKey: 'categoryId',
  sourceKey: 'id'
});

const Sequelize = require('sequelize');
const shortId = require('shortid');

const coupon = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  code: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  type: { type: Sequelize.STRING },
  isDisabled: { type: Sequelize.BOOLEAN, defaultValue: false},
  isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false },
  maxAmount: { type: Sequelize.FLOAT, allowNull: false },
  percentage: { type: Sequelize.INTEGER, allowNull: false },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const couponSchema = sequelize.define('Coupon', coupon, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = couponSchema;

const categoryCouponMappingSchema = require('../categoryCouponMapping/schema');
couponSchema.hasMany(categoryCouponMappingSchema, {
  as: 'categoryCouponMapping',
  foreignKey: 'couponId',
  sourceKey: 'id'
});

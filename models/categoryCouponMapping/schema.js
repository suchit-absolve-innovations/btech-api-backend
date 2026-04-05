const Sequelize = require('sequelize');
const shortId = require('shortid');

const categoryCouponMapping = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING,
    defaultValue: () => shortId.generate()
  },
  categoryId: {
    type: Sequelize.STRING,
    unique: 'category_coupon_mapping_category_id_coupon_id_unique',
    allowNull: false
  },
  couponId: {
    type: Sequelize.STRING,
    unique: 'category_coupon_mapping_category_id_coupon_id_unique',
    allowNull: false
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false
  },
  validFrom: {
    type: Sequelize.DATE,
    allowNull: false
  },
  validTill: {
    type: Sequelize.DATE,
    allowNull: false
  },
  minCartValue: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  isDisabled: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
  isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const categoryCouponMappingSchema = sequelize.define('CategoryCouponMapping', categoryCouponMapping, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = categoryCouponMappingSchema;

const userSchema = require('../member/schema');
const categorySchema = require('../category/schema');
const couponSchema = require('../coupon/schema');

// Member Association
categoryCouponMappingSchema.belongsTo(userSchema, {
  foreignKey: 'createdBy',
  targetKey: 'id',
  as: 'member'
});

// Category Association
categoryCouponMappingSchema.belongsTo(categorySchema, {
  foreignKey: 'categoryId',
  targetKey: 'id',
  as: 'category'
});

// Coupon Association
categoryCouponMappingSchema.belongsTo(couponSchema, {
  foreignKey: 'couponId',
  targetKey: 'id',
  as: 'coupon'
});

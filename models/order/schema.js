const Sequelize = require('sequelize');
const shortId = require('shortid');

const order = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  memberId: { type: Sequelize.STRING, allowNull: false },
  addressId: { type: Sequelize.STRING, allowNull: false },
  status: {
    type: Sequelize.ENUM,
    defaultValue: 'PENDING',
    values: ['ACCEPTED', 'DELIVERED', 'SHIPPED', 'PENDING', 'CANCELLED', 'RETURN', 'INCOMPLETE'],
    allowNull: false
  },
  paymentType: {
    type: Sequelize.ENUM,
    defaultValue: 'COD',
    values: ['ONLINE', 'COD']
  },
  info: { type: Sequelize.JSON, allowNull: false },
  amount: { type: Sequelize.FLOAT, allowNull: false },
  couponId: { type: Sequelize.STRING },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
};

const orderSchema = sequelize.define('Order', order, {
  freezeTableName: true
});

module.exports = orderSchema;

const memberSchema = require('../member/schema');
const addressSchema = require('../address/schema');

orderSchema.belongsTo(memberSchema, {
  as: 'member',
  foreignKey: 'memberId',
  sourceKey: 'id'
});

orderSchema.belongsTo(addressSchema, {
  as: 'address',
  foreignKey: 'addressId',
  sourceKey: 'id'
});

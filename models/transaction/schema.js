const Sequelize = require('sequelize');

const transaction = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  memberId: { type: Sequelize.STRING, allowNull: false },
  orderId: { type: Sequelize.STRING, allowNull: false },
  amount: { type: Sequelize.STRING, allowNull: false },
  status: {
    type: Sequelize.ENUM,
    values: ['PAID', 'FAILED', 'REFUND', 'PROCESSING'],
    allowNull: false
  },
  message: { type: Sequelize.STRING },
  info: { type: Sequelize.JSON },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
};

const transactionSchema = sequelize.define('Transactions', transaction, {
  freezeTableName: true
});

module.exports = transactionSchema;

const memberSchema = require('../member/schema');
const orderSchema = require('../order/schema');

transactionSchema.belongsTo(memberSchema, {
  as: 'member',
  foreignKey: 'memberId',
  sourceKey: 'id'
});

transactionSchema.belongsTo(orderSchema, {
  as: 'order',
  foreignKey: 'orderId',
  sourceKey: 'id'
});

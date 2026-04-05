const Sequelize = require('sequelize');
const shortId = require('shortid');

const address = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  memberId: { type: Sequelize.STRING, allowNull: false },
  countryId: { type: Sequelize.BIGINT, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  number: { type: Sequelize.STRING, allowNull: true },
  pinCode: { type: Sequelize.INTEGER, allowNull: false },
  address: { type: Sequelize.STRING, allowNull: false },
  city: { type: Sequelize.STRING, allowNull: false },
  state: { allowNull: false, type: Sequelize.STRING },
  landmark: { allowNull: true, type: Sequelize.STRING },
  alternateNumber: { allowNull: true, type: Sequelize.STRING },
  type: { allowNull: false, type: Sequelize.ENUM, values: ['HOME', 'WORK', 'OTHER'] },
  status: { type: Sequelize.BOOLEAN, defaultValue: true },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
};

const addressSchema = sequelize.define('Address', address, {
  freezeTableName: true
});

module.exports = addressSchema;

const memberSchema = require('../member/schema');
const countrySchema = require('../countryCode/schema');
const stateSchema = require('../states/schema');

// Member Association
addressSchema.belongsTo(memberSchema, {
  as: 'member',
  foreignKey: 'memberId',
  sourceKey: 'id'
});

// Country Association
addressSchema.belongsTo(countrySchema, {
  as: 'country',
  foreignKey: 'countryId',
  sourceKey: 'id'
});

// State Association
addressSchema.belongsTo(stateSchema, {
  as: 'states',
  foreignKey: 'state',
  sourceKey: 'id',
  constraints: false
});

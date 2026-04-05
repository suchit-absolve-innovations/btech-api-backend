const Sequelize = require('sequelize');
// eslint-disable-next-line no-unused-vars
const role = require('../roles/facade');

const countryCode = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  country: {
    type: Sequelize.STRING
  },
  countryCode: {
    type: Sequelize.STRING
  },
  internationalDialing: {
    type: Sequelize.STRING
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

const countryCodeSchema = sequelize.define('CountryCode', countryCode, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = countryCodeSchema;

const addressSchema = require('../address/schema');
const stateSchema = require('../states/schema');

// Address Associations
countryCodeSchema.hasMany(addressSchema, {
  as: 'addresses',
  foreignKey: 'countryId',
  sourceKey: 'id'
});

countryCodeSchema.hasMany(stateSchema, {
  as: 'state',
  foreignKey: 'countryId',
  sourceKey: 'id'
});
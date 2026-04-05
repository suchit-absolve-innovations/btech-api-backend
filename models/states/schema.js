const Sequelize = require('sequelize');

const state = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  countryId: {
    type: Sequelize.BIGINT
  },
  name: {
    type: Sequelize.STRING
  },
  abbreviation: {
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

const stateSchema = sequelize.define('State', state, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = stateSchema;

const countrySchema = require('../countryCode/schema');

// Address Associations
stateSchema.belongsTo(countrySchema, {
  as: 'country',
  foreignKey: 'countryId',
  targetKey: 'id'
});

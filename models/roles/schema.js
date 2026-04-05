const Sequelize = require('sequelize');

const role = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
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

const roleSchema = sequelize.define('Roles', role, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = roleSchema;

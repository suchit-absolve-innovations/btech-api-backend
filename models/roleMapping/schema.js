const Sequelize = require('sequelize');
// eslint-disable-next-line no-unused-vars
const role = require('../roles/facade');

const roleMapping = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.BIGINT,
    autoIncrement: true
  },
  roleId: {
    type: Sequelize.STRING,
    references: { model: 'Roles', key: 'id' },
    unique: 'role_mapping_member_id_role_id_unique',
    allowNull: false
  },
  memberId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'role_mapping_member_id_role_id_unique'
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

const roleMappingSchema = sequelize.define('RoleMapping', roleMapping, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = roleMappingSchema;

const userSchema = require('../member/schema');
const rolesSchema = require('../roles/schema');

// Member Association
roleMappingSchema.belongsTo(userSchema, {
  foreignKey: 'memberId',
  targetKey: 'id',
  as: 'member'
});

// Roles Association
roleMappingSchema.belongsTo(rolesSchema, {
  foreignKey: 'roleId',
  targetKey: 'id',
  as: 'role'
});

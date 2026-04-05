const Sequelize = require('sequelize');
const accessToken = {
  accessToken: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  accessTokenExpiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshTokenExpiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  memberId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  deviceType: {
    type: Sequelize.ENUM,
    values: ['android', 'ios', 'web'],
    require: true
  },
  deviceToken: {
    type: Sequelize.STRING
  }
};

const accessTokenSchema = sequelize.define('AccessToken', accessToken, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false
});

module.exports = accessTokenSchema;

const memberSchema = require('../member/schema');

accessTokenSchema.belongsTo(memberSchema, {
  foreignKey: 'memberId',
  as: 'member',
  targetKey: 'id'
});

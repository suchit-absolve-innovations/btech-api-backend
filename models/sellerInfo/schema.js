const Sequelize = require('sequelize');
const shortId = require('shortid');
const authUtils = require('../../utils/auth');

const info = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  memberId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  companyName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  companyRegId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  companyCity: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  abnNumber: {
    type: Sequelize.STRING
  },
  contactNumber: {
    type: Sequelize.STRING
  },
  businessEmail: {
    type: Sequelize.STRING
  },
  drivingLicence: {
    type: Sequelize.STRING
  },
  filePath: {
    type: Sequelize.STRING,
    get() {
      const value = this.getDataValue('filePath');
      if (!value) return null;
      return authUtils.getCompleteUrl(value);
    }
  },
  isApproved: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
};

const sellerInfoSchema = sequelize.define('SellerInfo', info, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = sellerInfoSchema;

const memberSchema = require('../member/schema');

// Address Associations
sellerInfoSchema.belongsTo(memberSchema, {
  as: 'member',
  foreignKey: 'memberId',
  targetKey: 'id'
});

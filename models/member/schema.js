const Sequelize = require('sequelize');
const shortId = require('shortid');
const uid = require('uid2');
const _ = require('lodash');
const config = require('config');
const moment = require('moment');

const member = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => shortId.generate()
  },
  username: { type: Sequelize.STRING, allowNull: true, unique: true },
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
  fbId: { type: Sequelize.STRING },
  googleId: { type: Sequelize.STRING },
  appleSub: { type: Sequelize.STRING },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  emailStatus: {
    type: Sequelize.ENUM,
    values: ['verified', 'pending', 'changed'],
    defaultValue: 'pending',
    allowNull: false
  },
  contactNumber: { type: Sequelize.STRING, allowNull: true, unique: true },
  password: { type: Sequelize.STRING },
  otp: { type: Sequelize.STRING },
  otpExpireAt: { allowNull: true, type: Sequelize.DATE },
  status: { type: Sequelize.BOOLEAN, defaultValue: true },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
};

const memberSchema = sequelize.define('Member', member, {
  freezeTableName: true
});

module.exports = memberSchema;

// Token Association
const accessTokenSchema = require('../accessToken/schema');
const roleMappingSchema = require('../roleMapping/schema');
const roleMappingFacade = require('../roleMapping/facade');
const productLikeFacade = require('../productLike/schema');
const addressSchema = require('../address/schema');
const orderSchema = require('../order/schema');
const sellerInfoSchema = require('../sellerInfo/schema');

// token Associations
memberSchema.hasMany(accessTokenSchema, {
  as: 'token',
  foreignKey: 'memberId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

// Role Associations
memberSchema.hasMany(roleMappingSchema, {
  as: 'role',
  foreignKey: 'memberId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

// Address Associations
memberSchema.hasMany(addressSchema, {
  as: 'addresses',
  foreignKey: 'memberId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

// Product Like Association
memberSchema.hasMany(productLikeFacade, {
  as: 'productLikes',
  foreignKey: 'memberId',
  sourceKey: 'id'
});

// Order Association
memberSchema.hasMany(orderSchema, {
  as: 'orders',
  foreignKey: 'memberId',
  sourceKey: 'id'
});

// Seller Info Association
memberSchema.hasOne(sellerInfoSchema, {
  as: 'sellerInfo',
  foreignKey: 'memberId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
  hooks: true
});

// to remove password every time
memberSchema.prototype.toJSON = function() {
  const member = this.dataValues;
  delete member.password;
  return member;
};

// add role
memberSchema.prototype.addRole = function(roleId) {
  const that = this;
  return new Promise(async (resolve, reject) => {
    const data = {
      roleId,
      memberId: that.id
    };
    try {
      await roleMappingFacade.create(data);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
// instance method for creating access-token

memberSchema.prototype.createAccessToken = function(deviceType, deviceToken) {
  // eslint-disable-next-line global-require
  const accessTokenFacade = require('../accessToken/facade');

  const that = this;
  return new Promise(async (resolve, reject) => {
    let token;
    const mToken = uid(config.get('accessTokenLength'));
    const rToken = uid(config.get('accessTokenLength'));
    const data = {
      accessToken: mToken,
      accessTokenExpiresAt: moment()
        .add(config.get('accessTokenLifetime'), 'seconds')
        .toISOString(),
      refreshToken: rToken,
      refreshTokenExpiresAt: moment()
        .add(config.get('refreshTokenLifetime'), 'seconds')
        .toISOString(),
      deviceType,
      memberId: that.id,
      deviceToken
    };

    try {
      token = await accessTokenFacade.create(data);
    } catch (e) {
      return reject(e);
    }
    resolve(token);
  });
};

memberSchema.prototype.getRoles = function() {
  const that = this;
  return new Promise(async (resolve, reject) => {
    const query = `SELECT roleId FROM RoleMapping WHERE memberId = '${that.id}';`;
    try {
      const rolesData = await that.sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT
      });
      if (_.isEmpty(rolesData)) return resolve([]);
      resolve(_.map(rolesData, 'roleId'));
    } catch (e) {
      reject(e);
    }
  });
};

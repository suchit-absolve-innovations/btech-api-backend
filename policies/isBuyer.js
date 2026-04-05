const config = require('config');
const moment = require('moment');
const accessTokenFacade = require('../models/accessToken/facade');
const roleMappingFacade = require('../models/roleMapping/facade');

module.exports = async function(req, res, next, cb) {
  let token = null;
  let mapping;
  const accessToken = req.header('Authorization');
  const memberId = req.header('id');
  const type = req.header('type');
  try {
    token = await accessTokenFacade.findOne({
      where: { accessToken, memberId }
    });
  } catch (e) {
    return cb(null, false);
  }
  if (!token) return cb(null, false);
  if (!moment(token.accessTokenExpiresAt).isSameOrAfter(moment().toISOString())) return cb(null, false);
  if (!moment(token.accessTokenExpiresAt).isSameOrAfter(moment().toISOString())) return cb(null, false);
  try {
    mapping = await roleMappingFacade.findOne({
      where: { memberId: token.memberId, roleId: 'buyer' },
      include: ['member']
    });
  } catch (e) {
    return cb(null, false);
  }
  if (!mapping) return cb(null, false);
  const roles = await mapping.member.getRoles();
  if (!config.get('isTesting') && type) {
    if (!roles.includes(type)) return cb(null, false);
  }
  req.member = mapping.member;
  req.token = token;
  req.roles = await mapping.member.getRoles();
  req.isBuyer = type === 'buyer';
  if (req.roles.includes('admin')) req.isAdmin = true;
  if (req.roles.includes('seller')) req.isSeller = true;
  next();
};

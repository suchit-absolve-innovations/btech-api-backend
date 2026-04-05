const moment = require('moment');
const accessTokenFacade = require('../models/accessToken/facade');

module.exports = async function(req, res, next, cb) {
  let token = null;
  const accessToken = req.header('Authorization');
  const memberId = req.header('id');
  const type = req.header('type');
  if (!accessToken || !memberId) return cb(null, false);
  try {
    token = await accessTokenFacade.findOne({
      where: { accessToken, memberId },
      include: ['member']
    });
    if (!token) return cb(null, false);
    if (!moment(token.accessTokenExpiresAt).isSameOrAfter(moment().toISOString())) return cb(null, false);
    if (!moment(token.accessTokenExpiresAt).isSameOrAfter(moment().toISOString())) return cb(null, false);
    req.member = token.member;
    req.token = token;
    req.roles = await token.member.getRoles();
    switch (type) {
      case 'buyer':
        req.isBuyer = true;
        break;
      case 'admin':
        req.isAdmin = true;
        break;
      case 'seller':
        req.isSeller = true;
        break;
      default:
      // do nothing
    }
    next();
  } catch (e) {
    return cb(null, false);
  }
};

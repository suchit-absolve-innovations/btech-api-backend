const jwt = require('jsonwebtoken');
const _ = require('lodash');
const qs = require('qs');
const axios = require('axios');
const Sequelize = require('sequelize');
const config = require('config');
const shortId = require('shortid');
const moment = require('moment');
const multer = require('multer');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const memberFacade = require('./facade');
const emailService = require('../../utils/email');
const authUtils = require('../../utils/auth');
const countryCodeFacade = require('../countryCode/facade');
const bannerFacade = require('../banner/facade');
const categoryFacade = require('../category/facade');
const productFacade = require('../product/facade');
const stateFacade = require('../states/facade');
const roleMappingFacade = require('../roleMapping/facade');
const sellerInfoFacade = require('../sellerInfo/facade');
const orderFacade = require('../order/facade');
const couponFacade = require('../coupon/facade');
const accessTokenFacade = require('../accessToken/facade');

const optLength = 46;
const fileFilter = (req, file, cb) => {
  if (_.includes(config.get('allowedImagesTypes'), file.mimetype)) return cb(null, true);
  req.mimeError = true;
  cb(null, false);
};

const sellerFileFilter = (req, file, cb) => {
  if (_.includes(config.get('allowedFileTypes'), file.mimetype)) return cb(null, true);
  req.mimeError = true;
  cb(null, false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/Banner');
  },
  filename: (req, file, cb) => {
    const origFilename = file.originalname;
    const parts = origFilename.split('.');
    const extension = parts[parts.length - 1];
    const id = shortId.generate();
    const newFilename = `${id}.${extension}`;
    req.pictureId = id;
    cb(null, newFilename);
  }
});

const sellerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/SellerDocs');
  },
  filename: (req, file, cb) => {
    const origFilename = file.originalname;
    const parts = origFilename.split('.');
    const extension = parts[parts.length - 1];
    const { id } = req.member.id;
    const newFilename = `${req.member.id}.${extension}`;
    req.pictureId = id;
    cb(null, newFilename);
  }
});
const multerConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.get('maxPictureSize') }
});
const sellerMulterConfig = multer({
  storage: sellerStorage,
  fileFilter: sellerFileFilter,
  limits: { fileSize: config.get('maxFileSize') }
});
const uploadBanner = Promise.promisify(multerConfig.single('banner'));
const uploadSellerFile = Promise.promisify(sellerMulterConfig.single('doc'));

const getClientSecret = () => {
  // sign with RSA SHA256
  const privateKey = fs.readFileSync('./app.p8');
  const headers = {
    alg: 'ES256',
    kid: '3W93NDRFN4'
  };
  const claims = {
    iss: 'NSNYYR8V29',
    aud: 'https://appleid.apple.com',
    sub: 'com.mrbandweb.btechnologies',
    iat: moment().unix(),
    exp: moment()
      .add(10, 'hour')
      .unix()
  };
  const token = jwt.sign(claims, privateKey, {
    header: headers
  });
  return token;
};
class MemberController {
  // SignUp
  async signUp(req, res, next) {
    let member;
    const { firstName, lastName, email, password, username, contactNumber, role } = req.body;
    const r = role.toLowerCase();
    try {
      member = await memberFacade.findOne({ where: { email } });
    } catch (err) {
      return next(err);
    }
    if (member) {
      const e = new Error('Email Already exists');
      e.statusCode = 400;
      return next(e);
    }
    const hashPassword = await authUtils.hashPassword(password);
    try {
      member = await memberFacade.create({
        username,
        firstName,
        lastName,
        password: hashPassword,
        email,
        contactNumber
      });
    } catch (err) {
      return next(err);
    }
    if (r === 'seller') {
      try {
        await member.addRole('buyer');
      } catch (err) {
        return next(err);
      }
    }
    try {
      await member.addRole(r);
    } catch (err) {
      return next(err);
    }

    try {
      await emailService.sendVerifyMail(member);
      return res.json({ message: 'Sign Up successful Verify Your Email' });
    } catch (err) {
      log.error(err);
      return res.json({
        message: 'Sign Up successful but verification email could not be sent right now',
        emailSent: false,
        memberId: member.id
      });
    }
  }

  async signInWithApple(req, res, next) {
    const { token, deviceToken, deviceType } = req.body;
    const clientSecret = getClientSecret();
    const data = qs.stringify({
      client_id: 'com.mrbandweb.btechnologies',
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: token
    });
    const config = {
      method: 'post',
      url: 'https://appleid.apple.com/auth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    };

    axios(config)
      .then(async function(response) {
        const idToken = jwt.decode(response.data.id_token);
        let member;
        let token;
        try {
          member = await memberFacade.findOne({ where: { email: idToken.email, appleSub: idToken.sub } });
        } catch (error) {
          return next(error);
        }
        if (member) {
          token = await member.createAccessToken(deviceType, deviceToken);
          token.dataValues.roles = await member.getRoles();
          token.dataValues.firstName = member.firstName;
          token.dataValues.lastName = member.lastName;
          return res.send(token);
        }
        let emailStatus = false;
        if (idToken.email_verified === 'true') emailStatus = true;
        try {
          member = await memberFacade.create({
            email: idToken.email,
            appleSub: idToken.sub,
            emailStatus
          });
        } catch (error) {
          return next(error);
        }
        try {
          await member.addRole('buyer');
        } catch (error) {
          return next(error);
        }
        try {
          token = await member.createAccessToken(deviceType, deviceToken);
        } catch (error) {
          return next(error);
        }
        token.dataValues.roles = await member.getRoles();
        token.dataValues.firstName = member.firstName;
        token.dataValues.lastName = member.lastName;
        return res.send(token);
      })
      .catch(function(error) {
        return next(error);
      });
  }

  // Verify Email
  async verifyEmail(req, res, next) {
    let member;
    const { token, id } = req.body;
    try {
      member = await memberFacade.findOne({ where: { id } });
    } catch (err) {
      return next(err);
    }
    if (!member) {
      const err = new Error('No Member Found');
      err.statusCode = 204;
      return next(err);
    }
    if (member.emailStatus === 'verified') {
      const err = new Error('Email Already Verified');
      err.statusCode = 403;
      return next(err);
    }
    if (member.otp !== token) {
      const err = new Error('Not a valid user');
      err.statusCode = 401;
      return next(err);
    }
    member.otp = null;
    member.emailStatus = 'verified';
    try {
      await member.save();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Email Verified Please Login' });
  }

  // Resend Verify Email
  async resendVerifyEmail(req, res, next) {
    const { email } = req.body;
    let member;

    try {
      member = await memberFacade.findOne({ where: { email } });
    } catch (e) {
      return next(e);
    }

    if (!member) {
      const error = new Error('Not found');
      error.statusCode = 204;
      return next(error);
    }

    if (member.emailStatus === 'verified') {
      const error = new Error('Email already verified');
      error.statusCode = 403;
      return next(error);
    }
    try {
      await emailService.sendVerifyMail(member);
      return res.json({ message: 'Email successfully send, please check your Mail' });
    } catch (err) {
      log.error(err);
      const error = new Error('Member found but verification email could not be sent right now');
      error.statusCode = 503;
      return next(error);
    }
  }

  // Show Profile
  async me(req, res, next) {
    let member;
    let include = [];
    if (req.roles.includes('seller') && req.isSeller) include = ['sellerInfo'];
    try {
      member = await memberFacade.findOne({ where: { id: req.member.id }, include });
    } catch (err) {
      return next(err);
    }
    res.send(member);
  }

  // Update Profile
  async updateProfile(req, res, next) {
    const { member } = req;
    let sendEmail = false;
    let message = 'Profile Updated';
    const d = {
      username: null,
      firstName: null,
      lastName: null,
      contactNumber: null,
      email: null
    };

    for (const key in d) {
      d[key] = req.body[key];
    }
    const obj = _.pickBy(d, h => !_.isUndefined(h));

    if (obj.email && obj.email !== member.email) {
      member.emailStatus = 'changed';
      obj.otp = await authUtils.generateToken(optLength);
      sendEmail = true;
    }

    for (const key in obj) {
      if (_.isUndefined(obj[key])) continue;
      member[key] = obj[key];
    }
    try {
      await member.save();
    } catch (err) {
      return next(err);
    }
    if (sendEmail) {
      message = 'Profile Updated Please Verify Your Email';
      emailService.sendVerifyMail(member).catch(err => log.error(err));
    }
    res.json({ message });
  }

  // change password
  async changePassword(req, res, next) {
    const { member } = req;
    const { oldPassword, newPassword } = req.body;

    if (!(await authUtils.matchPassword(oldPassword, member.password))) {
      const err = new Error('Wrong Password');
      err.statusCode = 403;
      return next(err);
    }
    const hashedPassword = await authUtils.hashPassword(newPassword);
    member.password = hashedPassword;
    try {
      await member.save();
    } catch (err) {
      return next(err);
    }
    // emailService.loginCredentials(member.email, member.username, newPassword);
    res.json({ message: 'Password Successfully Changed ' });
  }

  // Forgot Password
  async forgotPassword(req, res, next) {
    const { email } = req.body;

    let member;

    try {
      member = await memberFacade.findOne({ where: { email } });
    } catch (e) {
      return next(e);
    }

    if (!member) {
      const error = new Error('No Member Found');
      error.statusCode = 204;
      return next(error);
    }
    if (member.emailStatus === 'pending' || member.emailStatus === 'changed') {
      const error = new Error('Your email is not verified, please verify your email');
      error.statusCode = 403;
      return next(error);
    }
    emailService.sendForgotPasswordMail(member);

    res.json({
      message: 'We have send you an email. Please check it to reset your password'
    });
  }

  // Reset Password
  async resetPassword(req, res, next) {
    const { password, token, id } = req.body;
    let member;
    try {
      member = await memberFacade.findOne({ where: { otp: token, id } });
    } catch (e) {
      return next(e);
    }

    if (!member) {
      const error = new Error('No Member Found');
      error.statusCode = 204;
      return next(error);
    }
    if (moment().isAfter(moment(member.otpExpireAt))) {
      const error = new Error('Link Expired');
      error.statusCode = 403;
      return next(error);
    }
    if (member.emailStatus === 'pending' || member.emailStatus === 'changed') {
      const error = new Error('Your email is not verified, please verify your email');
      error.statusCode = 403;
      return next(error);
    }
    member.password = await authUtils.hashPassword(password);
    member.otp = null;
    member.otpExpireAt = null;
    try {
      await member.save();
    } catch (e) {
      return next(e);
    }
    res.json({ message: 'Password Changed' });
  }

  // logout
  async logout(req, res, next) {
    try {
      await req.token.destroy();
    } catch (e) {
      return next(e);
    }
    res.json({ message: ' Successfully logout' });
  }

  // get all country codes
  async getAllCountryCode(req, res, next) {
    let codes;
    try {
      codes = await countryCodeFacade.findAll({});
    } catch (e) {
      return next(e);
    }
    res.send(codes);
  }

  // upload banner
  async addBanner(req, res, next) {
    let banner;
    try {
      await uploadBanner(req, res);
    } catch (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 422;
        return next(err);
      }
      return next(err);
    }
    if (req.mimeError) {
      const error = new Error('Invalid File Type');
      error.statusCode = 422;
      return next(error);
    }
    if (!req.file) {
      const error = new Error('File is Required');
      error.statusCode = 422;
      return next(error);
    }
    const { name } = req.body;
    const { path } = req.file;
    try {
      await authUtils.imageCompress('static/Banner', path);
    } catch (err) {
      return next(err);
    }
    if (!req.body.categoryId && !req.body.productId) {
      const err = new Error('Category/Product id is required');
      err.statusCode = 400;
      await fs.unlinkAsync(path);
      return next(err);
    }
    try {
      banner = await bannerFacade.create({
        name,
        path,
        memberId: req.member.id,
        categoryId: req.body.categoryId,
        productId: req.body.productId,
        type: req.body.type
      });
    } catch (e) {
      await fs.unlinkAsync(path);
      return next(e);
    }
    res.send(banner);
  }

  // get banner
  async getBanner(req, res, next) {
    const { bannerId } = req.params;
    let banner;
    try {
      banner = await bannerFacade.findOne({ where: { id: bannerId } });
    } catch (err) {
      return next(err);
    }
    res.send(banner);
  }

  // get all banner
  async getBanners(req, res, next) {
    let banners;
    try {
      banners = await bannerFacade.findAll({});
    } catch (err) {
      return next(err);
    }
    res.send(banners);
  }

  // delete banner
  async deleteBanner(req, res, next) {
    const { bannerId } = req.params;
    let banner;
    try {
      banner = await bannerFacade.findOne({ where: { id: bannerId } });
    } catch (err) {
      return next(err);
    }
    if (!banner) {
      const err = new Error('No Banner Found');
      err.statusCode = 204;
      return next(err);
    }
    try {
      await authUtils.deleteImage(banner.path);
    } catch (err) {
      return next(err);
    }
    try {
      await banner.destroy();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Banner Deleted' });
  }

  // get all banner
  async stats(req, res, next) {
    const stats = { categoryCount: null, productCount: null, memberCount: null };
    let categoryCount;
    let productCount;
    let membersCount;
    try {
      categoryCount = await categoryFacade.count({});
    } catch (err) {
      return next(err);
    }
    try {
      membersCount = await memberFacade.count({});
    } catch (err) {
      return next(err);
    }
    try {
      productCount = await productFacade.count({});
    } catch (err) {
      return next(err);
    }
    stats.memberCount = membersCount.count;
    stats.productCount = productCount.count;
    stats.categoryCount = categoryCount.count;
    res.send(stats);
  }

  // get state by category id
  async states(req, res, next) {
    const { countryId } = req.params;
    let states;
    try {
      states = await stateFacade.findAll({ where: { countryId } });
    } catch (err) {
      return next(err);
    }
    res.send(states);
  }

  // get all users by role id
  async getMembers(req, res, next) {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    const { role } = req.query;
    let members = [];
    let where = {};
    if (role) where = { roleId: role };
    let count;
    let mappings;
    try {
      mappings = await roleMappingFacade.findAll({ offset, limit, where });
    } catch (err) {
      return next(err);
    }
    try {
      count = await roleMappingFacade.count({ where });
    } catch (err) {
      return next(err);
    }
    if (!_.isEmpty(mappings)) {
      const memberIds = _.map(mappings, 'memberId');
      try {
        members = await memberFacade.findAll({
          where: { id: { [Op.in]: memberIds } },
          include: ['addresses', 'sellerInfo']
        });
      } catch (err) {
        return next(err);
      }
    }
    for (const member of members) {
      member.dataValues.roles = await member.getRoles();
    }
    res.send({ totalCount: count.count, members });
  }

  // disable or enable member
  async status(req, res, next) {
    let member = null;
    const { memberId, action } = req.body;
    let message;
    let disable = true;

    try {
      member = await memberFacade.findOne({ where: { id: memberId } });
    } catch (err) {
      return next(err);
    }
    if (!member) {
      const err = new Error('Member Not Found');
      err.statusCode = 204;
      return next(err);
    }
    if (action === 'disable' && member.status === false) {
      message = 'member already disabled';
    } else if (action === 'enable' && member.status === true) {
      message = 'member already enabled';
    } else {
      if (action === 'disable') {
        disable = false;
        message = 'member disabled';
      } else {
        message = 'member enabled';
      }
      member.status = disable;
      try {
        await member.save();
      } catch (err) {
        return next(err);
      }
    }
    res.json({ message });
  }

  // get all users by category id
  async search(req, res, next) {
    let { name } = req.query;
    name = name.toLowerCase();
    let members;
    try {
      members = await memberFacade.findAll({
        where: {
          asset_name: sequelize.where(sequelize.fn('LOWER', sequelize.col('firstName')), 'LIKE', `%${name}%`)
        },
        limit: 7,
        include: ['addresses']
      });
    } catch (err) {
      return next(err);
    }
    for (const member of members) {
      member.dataValues.roles = await member.getRoles();
    }
    res.send({ totalCount: members.length, members });
  }

  // add seller company details
  async sellerInfo(req, res, next) {
    let info = await sellerInfoFacade.findOne({ where: { memberId: req.member.id } });
    if (info) return res.send(info);
    try {
      await uploadSellerFile(req, res);
    } catch (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 422;
        return next(err);
      }
      return next(err);
    }
    if (req.mimeError) {
      const error = new Error('Invalid File Type');
      error.statusCode = 422;
      return next(error);
    }
    if (!req.file) {
      const error = new Error('File is Required');
      error.statusCode = 422;
      return next(error);
    }

    const { path } = req.file;
    const {
      companyName,
      address,
      companyCity,
      companyRegId,
      drivingLicence,
      contactNumber,
      businessEmail,
      abnNumber
    } = req.body;

    info = await sellerInfoFacade.create({
      companyName,
      address,
      companyCity,
      companyRegId,
      drivingLicence,
      contactNumber,
      businessEmail,
      abnNumber,
      memberId: req.member.id,
      filePath: path
    });
    emailService.sendSellerInfo();
    res.send(info);
  }

  // add seller company details
  async updateSellerInfo(req, res, next) {
    const info = await sellerInfoFacade.findOne({ where: { memberId: req.member.id } });
    if (!info) {
      const error = new Error('No seller info found');
      error.statusCode = 204;
      return next(error);
    }
    let path;
    try {
      await uploadSellerFile(req, res);
    } catch (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 422;
        return next(err);
      }
      return next(err);
    }
    if (req.mimeError) {
      const error = new Error('Invalid File Type');
      error.statusCode = 422;
      return next(error);
    }
    if (req.file) {
      ({ path } = req.file);
    }

    const d = {
      companyName: null,
      address: null,
      companyCity: null,
      companyRegId: null,
      drivingLicence: null,
      contactNumber: null,
      businessEmail: null,
      abnNumber: null,
      filePath: null
    };
    for (const key in d) {
      d[key] = req.body[key];
    }
    const obj = _.pickBy(d, h => !_.isUndefined(h));
    if (path) obj.filePath = path;
    for (const key in obj) {
      if (_.isUndefined(obj[key])) continue;
      info[key] = obj[key];
    }
    try {
      await info.save();
    } catch (err) {
      return next(err);
    }

    res.send(info);
  }

  // get seller stats
  async sellerStats(req, res, next) {
    const stats = {
      todayOrderCount: null,
      weekOrderCount: null,
      monthOrderCount: null,
      todaySaleCount: null,
      weekSaleCount: null,
      monthSaleCount: null
    };

    const todayStartDate = moment()
      .startOf('day')
      .toISOString();
    const todayEndDate = moment()
      .endOf('day')
      .toISOString();
    const weekStartDay = moment()
      .startOf('week')
      .toISOString();
    const weekEndDay = moment()
      .endOf('week')
      .toISOString();
    const monthStartDay = moment()
      .startOf('month')
      .toISOString();
    const monthEndDay = moment()
      .endOf('month')
      .toISOString();
    let todayOrderCount;
    let weekOrderCount;
    let monthOrderCount;
    let todaySaleCount;
    let weekSaleCount;
    let monthSaleCount;
    try {
      todayOrderCount = await orderFacade.count({
        where: { createdAt: { [Op.between]: [todayStartDate, todayEndDate] }, status: 'ACCEPTED' }
      });
    } catch (err) {
      return next(err);
    }
    try {
      weekOrderCount = await orderFacade.count({
        where: { createdAt: { [Op.between]: [weekStartDay, weekEndDay] }, status: 'ACCEPTED' }
      });
    } catch (err) {
      return next(err);
    }
    try {
      monthOrderCount = await orderFacade.count({
        where: { createdAt: { [Op.between]: [monthStartDay, monthEndDay] }, status: 'ACCEPTED' }
      });
    } catch (err) {
      return next(err);
    }
    try {
      todaySaleCount = await orderFacade.count({
        where: { createdAt: { [Op.between]: [todayStartDate, todayEndDate] }, status: 'DELIVERED' }
      });
    } catch (err) {
      return next(err);
    }
    try {
      weekSaleCount = await orderFacade.count({
        where: { createdAt: { [Op.between]: [weekStartDay, weekEndDay] }, status: 'DELIVERED' }
      });
    } catch (err) {
      return next(err);
    }
    try {
      monthSaleCount = await orderFacade.count({
        where: { createdAt: { [Op.between]: [monthStartDay, monthEndDay] }, status: 'DELIVERED' }
      });
    } catch (err) {
      return next(err);
    }
    stats.todayOrderCount = todayOrderCount.count;
    stats.weekOrderCount = weekOrderCount.count;
    stats.monthOrderCount = monthOrderCount.count;
    stats.todaySaleCount = todaySaleCount.count;
    stats.weekSaleCount = weekSaleCount.count;
    stats.monthSaleCount = monthSaleCount.count;
    res.send(stats);
  }

  // approve or disapprove seller company details
  async approveSellerInfo(req, res, next) {
    let info;
    const { sellerId } = req.params;
    const { isApproved } = req.body;
    try {
      info = await sellerInfoFacade.findOne({ where: { memberId: sellerId } });
    } catch (error) {
      return error;
    }
    if (!info) {
      const error = new Error('No Found');
      error.statusCode = 204;
      return next(error);
    }
    info.isApproved = isApproved;
    try {
      await info.save();
    } catch (err) {
      return next(err);
    }

    res.send(info);
  }

  // approve or disapprove seller company details
  async addCoupon(req, res, next) {
    let coupon;
    const { code, name, type } = req.body;
    try {
      coupon = await couponFacade.findOne({ where: { code } });
    } catch (error) {
      return error;
    }
    if (coupon) {
      const err = new Error('This Coupon Code is already used');
      err.statusCode = 403;
      return next(err);
    }
    try {
      await couponFacade.create({ code, name, type });
    } catch (err) {
      return next(err);
    }
    res.send(coupon);
  }

  // get device token
  async deviceToken(req, res, next) {
    const limit = 100;
    const skip = req.query.skip * limit;
    let deviceTokens;
    try {
      deviceTokens = await accessTokenFacade.findAll({
        skip,
        limit,
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('deviceToken')), 'deviceToken']]
      });
    } catch (error) {
      return next(error);
    }
    if (!_.isEmpty(deviceTokens)) {
      deviceTokens = _.filter(deviceTokens, d => d.deviceToken !== ' ' && d.deviceToken);
    }
    res.send(deviceTokens);
  }
}
module.exports = new MemberController(memberFacade);

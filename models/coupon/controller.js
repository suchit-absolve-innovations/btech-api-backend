const moment = require('moment');
const couponFacade = require('./facade');
const categoryCouponMappingFacade = require('../categoryCouponMapping/facade');
class MemberController {
  // Add Coupon
  async addCoupon(req, res, next) {
    const { name, code, type, maxAmount, percentage } = req.body;
    let coupon;
    try {
      coupon = await couponFacade.create({ name, code, type, maxAmount, percentage });
    } catch (err) {
      return next(err);
    }
    res.send(coupon);
  }

  // Get All Coupons
  async getCoupons(req, res, next) {
    let coupons;
    try {
      coupons = await couponFacade.findAll({ where: { isDeleted: false } });
    } catch (err) {
      return next(err);
    }
    res.send(coupons);
  }

  // Get Coupon by ID
  async getCoupon(req, res, next) {
    const { couponId } = req.params;
    let coupon;
    try {
      coupon = await couponFacade.findOne({ where: { id: couponId, isDeleted: false } });
    } catch (err) {
      return next(err);
    }
    if (!coupon) {
      const err = new Error('No Coupon Found');
      err.statusCode = 204;
      return next(err);
    }
    res.send(coupon);
  }

  // Delete Coupons by ID
  async updateCoupon(req, res, next) {
    const { couponId } = req.params;
    const { name, type, isDisabled, code, percentage, maxAmount } = req.body;
    let coupon;
    try {
      coupon = await couponFacade.findOne({ where: { id: couponId } });
    } catch (err) {
      return next(err);
    }
    if (!coupon) {
      const err = new Error('No Coupon Found');
      err.statusCode = 204;
      return next(err);
    }
    if (name) coupon.name = name;
    if (code) coupon.code = name;
    if (type) coupon.type = type;
    if (percentage) coupon.percentage = percentage;
    if (maxAmount) coupon.maxAmount = maxAmount;
    coupon.isDisabled = isDisabled;
    try {
      await coupon.save();
    } catch (err) {
      return next(err);
    }
    res.send(coupon);
  }

  // Delete Coupons by ID
  async deleteCoupon(req, res, next) {
    const { couponId } = req.params;
    let coupon;
    try {
      coupon = await couponFacade.findOne({ where: { id: couponId } });
    } catch (err) {
      return next(err);
    }
    if (!coupon) {
      const err = new Error('No Coupon Found');
      err.statusCode = 204;
      return next(err);
    }
    coupon.isDeleted = true;
    try {
      await coupon.save();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Deleted' });
  }

  // Map Coupon
  async mapCoupon(req, res, next) {
    const { couponId, categoryId, minCartValue } = req.body;
    let { validTill, validFrom } = req.body;
    validFrom = moment(validFrom);
    validTill = moment(validTill);
    let couponMapping;
    try {
      couponMapping = await categoryCouponMappingFacade.findOne({ where: { couponId, categoryId } });
    } catch (error) {
      return next(error);
    }
    if (couponMapping) {
      const err = new Error('this category already has this coupon');
      err.statusCode = 403;
      return next(err);
    }
    if (validTill.isSameOrBefore(validFrom)) {
      const err = new Error('invalid date');
      err.statusCode = 403;
      return next(err);
    }
    try {
      couponMapping = await categoryCouponMappingFacade.create({
        couponId,
        categoryId,
        validTill: validTill.toDate(),
        validFrom: validFrom.toDate(),
        minCartValue,
        createdBy: req.member.id
      });
    } catch (err) {
      return next(err);
    }
    res.send(couponMapping);
  }

  // update Map Coupon
  async updateMapping(req, res, next) {
    const { mappingId } = req.params;
    const { minCartValue } = req.body;
    let { validTill, validFrom } = req.body;
    if ((validFrom && !validTill) || (!validFrom && validTill)) {
      const err = new Error('Both dates are required');
      err.statusCode = 422;
      return next(err);
    }
    if (validFrom) {
      validFrom = moment(validFrom);
      validTill = moment(validTill);
    }
    let couponMapping;
    try {
      couponMapping = await categoryCouponMappingFacade.findOne({ where: { id: mappingId } });
    } catch (error) {
      return next(error);
    }
    if (!couponMapping) {
      const err = new Error('Mapping not found');
      err.statusCode = 403;
      return next(err);
    }
    if (validFrom && validTill.isSameOrBefore(validFrom)) {
      const err = new Error('invalid date');
      err.statusCode = 403;
      return next(err);
    }
    if (validFrom) couponMapping.validFrom = validFrom.toDate();
    if (validTill) couponMapping.validTill = validTill.toDate();
    if (minCartValue) couponMapping.minCartValue = minCartValue;
    try {
      couponMapping = await couponMapping.save();
    } catch (err) {
      return next(err);
    }
    res.json({message: 'Successfully Updated'});
  }

  // get all Coupon Mapping
  async getMapping(req, res, next) {
    let couponMapping;
    try {
      couponMapping = await categoryCouponMappingFacade.findAll({ include: ['category', 'coupon'] });
    } catch (error) {
      return next(error);
    }
    res.send(couponMapping);
  }
}

module.exports = new MemberController(couponFacade);

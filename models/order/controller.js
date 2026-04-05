const _ = require('lodash');
const moment = require('moment');
const orderFacade = require('./facade');
const productFacade = require('../product/facade');
const cartFacade = require('../cart/facade');
const addressFacade = require('../address/facade');
const categoryCouponMappingFacade = require('../categoryCouponMapping/facade');
const emailUtil = require('../../utils/email');

class MemberController {
  // create order
  async add(req, res, next) {
    const { addressId, couponCode, paymentType } = req.body;
    let cart;
    let order;
    let address;
    let categoryCouponMapping;
    let discount;
    let t;
    const info = [];
    try {
      await orderFacade.update(
        { status: 'INCOMPLETE' },
        { where: { memberId: req.member.id, status: 'PENDING' } }
      );
    } catch (err) {
      return next(err);
    }
    try {
      cart = await cartFacade.findAll({ where: { memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    if (_.isEmpty(cart)) {
      const err = new Error('Cart is Empty Please add some product in your cart');
      err.statusCode = 204;
      return next(err);
    }
    try {
      address = await addressFacade.findOne({
        where: { id: addressId, memberId: req.member.id },
        include: ['states', 'country']
      });
    } catch (err) {
      return next(err);
    }
    if (!address) {
      const err = new Error('No address found please add your address');
      err.statusCode = 204;
      return next(err);
    }
    // check coupon
    if (couponCode) {
      const todayDate = moment().toDate();
      try {
        categoryCouponMapping = await categoryCouponMappingFacade.findOne({
          where: {
            [Op.and]: [{ validFrom: { [Op.lte]: todayDate } }, { validTill: { [Op.gte]: todayDate } }]
          },
          include: [{ association: 'coupon', where: { code: couponCode }, required: true }]
        });
      } catch (err) {
        return next(err);
      }
      if (!categoryCouponMapping) {
        const error = new Error('This Coupon is not valid');
        error.statusCode = 403;
        return next(error);
      }
      // check any of product with same category id
      const sameProduct = _.filter(cart, c => c.categoryId === categoryCouponMapping.categoryId);
      if (!_.isEmpty(sameProduct)) {
        const totalAmount = _.sumBy(sameProduct, 'amount');

        // calculate coupon discount
        if (totalAmount >= categoryCouponMapping.minCartValue) {
          discount = (totalAmount * categoryCouponMapping.coupon.percentage) / 100;
          if (discount > categoryCouponMapping.coupon.maxAmount) discount = categoryCouponMapping.coupon.maxAmount;
        }
      }
    }
    try {
      t = await sequelize.transaction();
    } catch (err) {
      await t.rollback();
      return next(err);
    }
    const products = [];
    for (const cartProduct of cart) {
      let product;

      // map order data for every product
      const orderInfo = {
        quantity: null,
        productId: null,
        price: null,
        sellerId: null,
        cartId: null,
        categoryId: null,
        salePrice: null
      };
      try {
        product = await productFacade.findOne({ where: { id: cartProduct.productId }, include: ['images'] });
      } catch (err) {
        await t.rollback();
        return next(err);
      }
      const productQuantity = JSON.parse(product.info.quantity);
      if (cartProduct.quantity > productQuantity) {
        const err = new Error('Product Out of stock');
        err.statusCode = 400;
        await t.rollback();
        return next(err);
      }
      orderInfo.price = cartProduct.amount;
      orderInfo.productId = product.id;
      orderInfo.quantity = cartProduct.quantity;
      orderInfo.sellerId = product.sellerId;
      orderInfo.cartId = cartProduct.id;
      orderInfo.categoryId = product.categoryId;
      orderInfo.salePrice = product.salePrice;

      info.push(orderInfo);
      products.push(product);
    }
    const amount = _.sumBy(info, 'salePrice');
    let status = 'PENDING';
    if (paymentType === 'COD') status = 'ACCEPTED';
    const orderData = { memberId: req.member.id, addressId, info, amount, paymentType, status };
    // check if order then subtract discount from total order amount
    if (discount) {
      orderData.amount -= discount;
      orderData.couponId = categoryCouponMapping.couponId;
    }
    orderData.amount = _.round(orderData.amount, 2);
    // save order
    try {
      order = await orderFacade.create(orderData, { transaction: t });
    } catch (err) {
      await t.rollback();
      return next(err);
    }
    if (paymentType === 'COD') {
      const productIds = _.map(order.info, 'productId');
      for (const productId of productIds) {
        let product;
        try {
          product = await productFacade.findOne({
            where: { id: productId }
          });
        } catch (err) {
          await t.rollback();
          return next(err);
        }
        const p = _.find(order.info, i => i.productId === product.id);
        const info = _.cloneDeep(product.info);
        info.quantity -= p.quantity;
        product.info = info;
        try {
          await product.save({ transaction: t });
        } catch (err) {
          await t.rollback();
          return next(err);
        }
      }
      const cartIds = _.map(order.info, 'cartId');
      try {
        await cartFacade.destroy({ where: { id: { [Op.in]: cartIds } }, transaction: t });
      } catch (err) {
        await t.rollback();
        return next(err);
      }
    }
    address.dataValues.stateName = address.states ? address.states.name : null;
    address.dataValues.countryName = address.country ? address.country.country : null;
    delete address.dataValues.country;
    delete address.dataValues.states;
    order.dataValues.address = address;

    order.dataValues.products = products;
    await t.commit();
    if (paymentType === 'COD') emailUtil.orderPlaced(order, req.member);
    res.send(order);
  }

  // get all order for admin and seller

  async getOrders(req, res, next) {
    let orders;
    let totalCount;
    const where = {};
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    const { status, categoryId } = req.query;
    let { startDate, endDate } = req.query;
    if ((startDate && !endDate) || (!startDate && endDate)) {
      const err = new Error('Not a valid date range');
      err.statusCode = 400;
      return next(err);
    }
    if (startDate) {
      startDate = moment(startDate).startOf('day');
      endDate = moment(endDate).endOf('day');
      where.createdAt = { [Op.between]: [startDate.toDate(), endDate.toDate()] };
    }
    if (status) where.status = status;
    try {
      orders = await orderFacade.findAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });
    } catch (err) {
      return next(err);
    }
    try {
      totalCount = await orderFacade.count({
        where
      });
    } catch (err) {
      return next(err);
    }
    if (categoryId || req.isSeller) {
      orders = _.filter(orders, order => {
        for (const info of order.info) {
          if (categoryId && !req.isSeller) {
            if (info.categoryId === categoryId) return info;
          } else if (!categoryId && req.isSeller) {
            if (info.sellerId === req.member.id) return info;
          } else if (info.sellerId === req.member.id && info.categoryId === categoryId) return info;
        }
      });
    }
    for (const order of orders) {
      const productIds = _.map(order.info, 'productId');
      let product;
      let address;
      try {
        product = await productFacade.findAll({
          where: { id: { [Op.in]: productIds } },
          include: ['images']
        });
      } catch (err) {
        return next(err);
      }
      try {
        address = await addressFacade.findOne({
          where: { id: order.addressId },
          include: ['country', { association: 'states' }]
        });
      } catch (err) {
        return next(err);
      }
      if (address) {
        address.dataValues.stateName = address.states.name;
        address.dataValues.countryName = address.country.country;
        delete address.dataValues.country;
        delete address.dataValues.states;
      }

      order.dataValues.products = _.cloneDeep(product);
      order.dataValues.address = _.cloneDeep(address);
      order.dataValues.totalCount = totalCount.count;
    }
    res.send(orders);
  }

  // get all own order
  async get(req, res, next) {
    let orders;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    try {
      orders = await orderFacade.findAll({
        offset,
        limit,
        where: { memberId: req.member.id },
        order: [['createdAt', 'DESC']]
      });
    } catch (err) {
      return next(err);
    }
    for (const order of orders) {
      const productIds = _.map(order.info, 'productId');
      let product;
      let address;
      try {
        product = await productFacade.findAll({
          where: { id: { [Op.in]: productIds } },
          include: ['images']
        });
      } catch (err) {
        return next(err);
      }
      try {
        address = await addressFacade.findOne({
          where: { id: order.addressId }
        });
      } catch (err) {
        return next(err);
      }
      order.dataValues.products = _.cloneDeep(product);
      order.dataValues.address = _.cloneDeep(address);
    }
    res.send(orders);
  }

  // need to check
  async update(req, res, next) {
    const { orderId } = req.params;
    const { status } = req.query;
    let order;
    try {
      order = await orderFacade.findOne({ where: { id: orderId } });
    } catch (err) {
      return next(err);
    }
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 204;
      return next(err);
    }
    order.status = status;
    try {
      await order.save();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Order updated' });
  }

  // get all own order
  async getOrderById(req, res, next) {
    let order;
    const { orderId } = req.params;
    const where = { id: orderId };
    const mappedInfo = [];
    if (!req.roles.includes('admin') && !req.roles.includes('seller')) where.memberId = req.member.id;
    try {
      order = await orderFacade.findOne({ where });
    } catch (err) {
      return next(err);
    }
    if (!order) {
      const err = new Error('No order found');
      err.statusCode = 204;
      return next(err);
    }
    if (req.roles.includes('seller') && req.isSeller) {
      for (const info of order.info) {
        if (info.sellerId === req.member.id) {
          mappedInfo.push(info);
        }
      }
    }
    if (req.roles.includes('seller') && req.isSeller) {
      order.info = _.filter(order.info, info => {
        if (info.sellerId === req.member.id) return info;
      });
    }
    if (req.roles.includes('seller') && !req.isAdmin && _.isEmpty(order.info) && req.isSeller) {
      const err = new Error('No order found');
      err.statusCode = 204;
      return next(err);
    }
    const productIds = _.map(order.info, 'productId');
    let product;
    let address;
    try {
      product = await productFacade.findAll({
        where: { id: { [Op.in]: productIds } },
        include: ['images', 'likes']
      });
    } catch (err) {
      return next(err);
    }
    try {
      address = await addressFacade.findOne({
        where: { id: order.addressId }
      });
    } catch (err) {
      return next(err);
    }
    order.dataValues.products = _.cloneDeep(product);
    order.dataValues.address = _.cloneDeep(address);
    res.send(order);
  }

  // get all own order
  async getOrderStatus(req, res, next) {
    res.json({ status: ['ACCEPTED', 'DELIVERED', 'SHIPPED', 'PENDING', 'CANCELLED', 'RETURN'] });
  }
}

module.exports = new MemberController(orderFacade);

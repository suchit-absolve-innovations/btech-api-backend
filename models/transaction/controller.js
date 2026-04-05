/* eslint-disable no-case-declarations */
const moment = require('moment');
const config = require('config');
const stripe = require('stripe')(config.get('striptSecretKey'));
const Promise = require('bluebird');
const _ = require('lodash');
const transactionFacade = require('./facade');
const orderFacade = require('../order/facade');
const productFacade = require('../product/facade');
const cartFacade = require('../cart/facade');
const emailUtil = require('../../utils/email');

const paymentSucceeded = async obj =>
  new Promise(async (resolve, reject) => {
    const { t, transaction, order, paymentMethod } = obj;
    transaction.status = 'PAID';
    transaction.info = paymentMethod;
    transaction.amount = paymentMethod.amount;
    order.status = 'ACCEPTED';
    const productIds = _.map(order.info, 'productId');
    for (const productId of productIds) {
      let product;
      try {
        product = await productFacade.findOne({
          where: { id: productId }
        });
      } catch (err) {
        return reject(err);
      }
      const p = _.find(order.info, i => i.productId === product.id);
      const info = _.cloneDeep(product.info);
      info.quantity -= p.quantity;
      product.info = info;
      try {
        await product.save({ transaction: t });
      } catch (err) {
        await t.rollback();
        return reject(err);
      }
    }
    try {
      await order.save({ transaction: t });
    } catch (err) {
      await t.rollback();
      return reject(err);
    }
    try {
      await transaction.save({ transaction: t });
    } catch (err) {
      await t.rollback();
      return reject(err);
    }

    // empty cart
    const cartIds = _.map(order.info, 'cartId');
    try {
      await cartFacade.destroy({ where: { id: { [Op.in]: cartIds } }, transaction: t });
    } catch (err) {
      await t.rollback();
      return reject(err);
    }
    return resolve();
  });

const paymentFailed = async obj =>
  new Promise(async (resolve, reject) => {
    const { t, transaction, order, paymentMethod } = obj;
    transaction.status = 'FAILED';
    transaction.info = paymentMethod;
    order.status = 'ACCEPTED';
    try {
      await order.save({ transaction: t });
    } catch (err) {
      await t.rollback();
      return reject(err);
    }
    return resolve(transaction);
  });

const paymentProcessing = async obj =>
  new Promise(async (resolve, reject) => {
    const { t, transaction, order, paymentMethod } = obj;
    transaction.status = 'PROCESSING';
    transaction.info = paymentMethod;
    order.status = 'PENDING';
    try {
      await order.save({ transaction: t });
    } catch (err) {
      await t.rollback();
      return reject(err);
    }
    return resolve(transaction);
  });

class MemberController {
  async createTransaction(req, res, next) {
    const { orderId } = req.params;
    let order;
    let paymentIntent;
    try {
      order = await orderFacade.findOne({ where: { id: orderId } });
    } catch (err) {
      return next(err);
    }
    if (!order) {
      const err = new Error('Not a valid Order');
      err.statusCode = 204;
      return next(err);
    }
    const totalAmount = _.sumBy(order.info, 'price');
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'aud'
      });
    } catch (error) {
      return next(error);
    }

    try {
      await transactionFacade.create({
        id: paymentIntent.id,
        memberId: req.member.id,
        orderId,
        status: 'PROCESSING',
        amount: _.round(totalAmount)
      });
    } catch (error) {
      return next(error);
    }
    res.send({ striptTransactionId: paymentIntent, totalAmount });
  }

  async webhook(req, res, next) {
    const { data, type } = req.body;
    const paymentMethod = data.object;
    let transaction;
    let order;
    let t;
    try {
      transaction = await transactionFacade.findOne({
        where: { id: data.object.id }
      });
    } catch (error) {
      return next(error);
    }
    if (!transaction) {
      const error = new Error('No Transaction Found');
      error.statusCode = 204;
      return next(error);
    }
    try {
      order = await orderFacade.findOne({
        where: { id: transaction.orderId }
      });
    } catch (error) {
      return next(error);
    }
    if (!order) {
      const error = new Error('No Order Found');
      error.statusCode = 204;
      return next(error);
    }
    try {
      t = await sequelize.transaction();
    } catch (err) {
      await t.rollback();
      return next(err);
    }
    const obj = { t, transaction, order, paymentMethod };
    // Handle the event
    switch (type) {
      case 'payment_intent.failed':
        try {
          transaction = await paymentFailed(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'order.payment_failed':
        try {
          transaction = await paymentFailed(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'payment_intent.payment_failed':
        try {
          transaction = await paymentFailed(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'payment_intent.canceled':
        try {
          transaction = await paymentFailed(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'payment_intent.succeeded':
        try {
          await paymentSucceeded(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'order.payment_succeeded':
        try {
          await paymentSucceeded(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'invoice.paid':
        try {
          await paymentSucceeded(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'payout.paid':
        try {
          await paymentSucceeded(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      case 'payment_intent.processing':
        try {
          await paymentProcessing(obj);
        } catch (error) {
          await t.rollback();
          return next(error);
        }
        break;
      default:
        // Unexpected event type
        await t.rollback();
        return res.status(400).send('Unexpected event type');
    }
    try {
      await transaction.save();
    } catch (error) {
      await t.rollback();
      return next(error);
    }
    await t.commit();
    if (transaction.status === 'PROCESSING') emailUtil.orderPlaced(order)
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }

  // // create order
  // async add(req, res, next) {
  //   const { orderId, amount, status, message, info, transactionId } = req.body;
  //   let order;
  //   let transaction;
  //   let t;
  //   try {
  //     order = await orderFacade.findOne({ where: { memberId: req.member.id, id: orderId } });
  //   } catch (err) {
  //     return next(err);
  //   }
  //   if (!order) {
  //     const err = new Error('Not a valid Order');
  //     err.statusCode = 204;
  //     return next(err);
  //   }
  //   try {
  //     t = await sequelize.transaction();
  //   } catch (err) {
  //     await t.rollback();
  //     return next(err);
  //   }
  //   if (status !== 'PAID') {
  //     const productIds = _.map(order.info, 'productId');
  //     for (const productId of productIds) {
  //       let product;
  //       try {
  //         product = await productFacade.findOne({
  //           where: { id: productId }
  //         });
  //       } catch (err) {
  //         return next(err);
  //       }
  //       const p = _.find(order.info, i => i.productId === product.id);
  //       const info = _.cloneDeep(product.info);
  //       info.quantity -= p.quantity;
  //       product.info = info;
  //       try {
  //         await product.save({ transaction: t });
  //       } catch (err) {
  //         await t.rollback();
  //         return next(err);
  //       }
  //     }
  //   } else if (status === 'REFUND') {
  //     const productIds = _.map(order.info, 'productId');
  //     for (const productId of productIds) {
  //       let product;
  //       try {
  //         product = await productFacade.findOne({
  //           where: { id: productId }
  //         });
  //       } catch (err) {
  //         await t.rollback();
  //         return next(err);
  //       }
  //       const p = _.find(order.info, i => i.productId === product.id);
  //       const info = _.cloneDeep(product.info);
  //       info.quantity += p.quantity;
  //       product.info = info;
  //       try {
  //         await product.save({ transaction: t });
  //       } catch (err) {
  //         await t.rollback();
  //         return next(err);
  //       }
  //     }
  //   }
  //   try {
  //     transaction = await transactionFacade.create(
  //       {
  //         id: transactionId,
  //         memberId: req.member.id,
  //         orderId,
  //         status,
  //         message,
  //         amount,
  //         info
  //       },
  //       { transaction: t }
  //     );
  //   } catch (err) {
  //     await t.rollback();
  //     return next(err);
  //   }
  //   // empty cart

  //   const cartIds = _.map(order.info, 'cartId');

  //   try {
  //     await cartFacade.destroy({ where: { id: { [Op.in]: cartIds } }, transaction: t });
  //   } catch (err) {
  //     await t.rollback();
  //     return next(err);
  //   }
  //   await t.commit();
  //   res.send(transaction);
  // }

  // get all own transactions details
  async get(req, res, next) {
    let transactions;
    try {
      transactions = await transactionFacade.findAll({ where: { memberId: req.member.id }, include: ['order'] });
    } catch (err) {
      return next(err);
    }
    // for (const transaction of transactions) {
    //   const productIds = _.map(order.info, 'productId');
    //   console.log(productIds);
    //   let product;
    //   try {
    //     product = await productFacade.findAll({
    //       where: { id: { [Op.in]: productIds } },
    //       include: ['images', 'likes']
    //     });
    //   } catch (err) {
    //     return next(err);
    //   }
    // }
    res.send(transactions);
  }

  // get all transactions admin
  async search(req, res, next) {
    const where = {};
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    const { status } = req.query;
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
    let transactions;
    try {
      transactions = await transactionFacade.findAll({ where, include: ['order'], offset, limit });
    } catch (err) {
      return next(err);
    }
    // for (const transaction of transactions) {
    //   const productIds = _.map(order.info, 'productId');
    //   console.log(productIds);
    //   let product;
    //   try {
    //     product = await productFacade.findAll({
    //       where: { id: { [Op.in]: productIds } },
    //       include: ['images', 'likes']
    //     });
    //   } catch (err) {
    //     return next(err);
    //   }
    // }
    res.send(transactions);
  }
}

module.exports = new MemberController(orderFacade);

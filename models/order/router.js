const { Router } = require('express');
const { body, query, check } = require('express-validator/check');
const validator = require('../../utils/validator');
const controller = require('./controller');
const authUtils = require('../../utils/auth');

const router = new Router();

// Add and get all categories
router
  .route('/')
  .post(
    [
      [
        body('addressId').exists(),
        body('couponCode').optional(),
        body('paymentType')
          .exists()
          .isIn(['ONLINE', 'COD']),
        validator
      ],
      authUtils.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.add(...args)
  )
  .get(
    [
      [
        query('offset')
          .optional()
          .toInt()
          .isInt({ min: 0 })
          .withMessage('Invalid offset'),
        query('limit')
          .optional()
          .toInt()
          .isInt({ min: 0, max: 20 })
          .withMessage('Invalid limit not greater than 20'),
        validator
      ],
      authUtils.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.get(...args)
  );

// update order
router
  .route('/:orderId')
  .put(
    [
      [
        query('status')
          .exists()
          .isString()
          .isIn(['ACCEPTED', 'DELIVERED', 'SHIPPED', 'PENDING', 'CANCELLED', 'RETURN']),
        check('orderId')
          .exists()
          .isString(),
        validator
      ],
      authUtils.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.update(...args)
  )
  .get([authUtils.runPolicies.bind(['isAdmin', 'isSeller', 'isAuthenticated'])], (...args) =>
    controller.getOrderById(...args)
  );

router.route('/Admin/All').get(
  [
    [
      query('offset')
        .optional()
        .toInt()
        .isInt({ min: 0 })
        .withMessage('Invalid offset'),
      query('limit')
        .optional()
        .toInt()
        .isInt({ min: 0, max: 20 })
        .withMessage('Invalid limit not greater than 20'),
      query('categoryId')
        .optional()
        .isString(),
      query('status')
        .optional()
        .isString()
        .isIn(['ACCEPTED', 'DELIVERED', 'SHIPPED', 'PENDING', 'CANCELLED', 'RETURN']),
      query('startDate')
        .optional()
        .isISO8601(),
      query('endDate')
        .optional()
        .isISO8601(),
      validator
    ],
    authUtils.runPolicies.bind(['isSeller', 'isAdmin'])
  ],
  (...args) => controller.getOrders(...args)
);

router.route('/Delivery/Status').get((...args) => controller.getOrderStatus(...args));

module.exports = router;

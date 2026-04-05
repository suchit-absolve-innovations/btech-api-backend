const { Router } = require('express');
const { body } = require('express-validator/check');
const validator = require('../../utils/validator');
const controller = require('./controller');
const authUtils = require('../../utils/auth');

const router = new Router();

// get all categories
router.route('/').get(authUtils.runPolicies.bind(['isAuthenticated']), (...args) => controller.get(...args));

router
  .route('/Initiate/:orderId')
  .post([authUtils.runPolicies.bind(['isAuthenticated'])], (...args) => controller.createTransaction(...args));

router.route('/Validate').post(
  [
    body('type')
      .optional()
      .isIn([
        'payment_intent.failed',
        'order.payment_failed',
        'payment_intent.payment_failed',
        'payment_intent.canceled',
        'payment_intent.succeeded',
        'order.payment_succeeded',
        'invoice.paid',
        'payout.paid',
        'payment_intent.processing'
      ]),
    validator
  ],
  (...args) => controller.webhook(...args)
);

router.route('/Admin').get(
  [
    [
      body('status')
        .optional()
        .isIn(['PAID', 'FAILED', 'REFUND']),
      body('startDate')
        .optional()
        .isISO8601(),
      body('endDate')
        .optional()
        .isISO8601(),
      validator
    ],
    authUtils.runPolicies.bind(['isAdmin'])
  ],
  (...args) => controller.search(...args)
);

// // update and delete product from cart
// router.route('/').put(
//   [
//     [
//       query('status')
//         .exists()
//         .isString()
//         .isIn(['ACCEPTED', 'DELIVERED', 'SHIPPED', 'PENDING']),
//       query('transactionId')
//         .exists()
//         .isString(),
//       validator
//     ],
//     authUtils.runPolicies.bind(['isAuthenticated'])
//   ],
//   (...args) => controller.update(...args)
// );

module.exports = router;

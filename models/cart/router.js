const { Router } = require('express');
const { body, check } = require('express-validator/check');
const validator = require('../../utils/validator');
const controller = require('./controller');
const authUtils = require('../../utils/auth');

const router = new Router();

// Add and get all categories
router
  .route('/')
  .post(
    [
      [body('productId').exists(), body('quantity').exists(), validator],
      authUtils.runPolicies.bind(['isAdmin', 'isBuyer'])
    ],
    (...args) => controller.add(...args)
  )
  .get(authUtils.runPolicies.bind(['isAdmin', 'isBuyer']), (...args) => controller.get(...args))
  .delete(authUtils.runPolicies.bind(['isAdmin', 'isBuyer']), (...args) => controller.empty(...args));

// update and delete product from cart
router
  .route('/:productId')
  .put(
    [
      [body('quantity').exists(), check('productId').exists(), validator],
      authUtils.runPolicies.bind(['isAdmin', 'isBuyer'])
    ],
    (...args) => controller.update(...args)
  )
  .delete([authUtils.runPolicies.bind(['isAdmin', 'isBuyer'])], (...args) => controller.delete(...args));

router.route('/Offline').post(
  [
    [
      body('products')
        .exists()
        .withMessage('Array of product with productId and quantity required')
    ],
    authUtils.runPolicies.bind(['isAdmin', 'isBuyer'])
  ],
  (...args) => controller.addOfflineCart(...args)
);

router
  .route('/CartTotalCount')
  .get([authUtils.runPolicies.bind(['isAuthenticated'])], (...args) => controller.getCount(...args));

module.exports = router;

const { Router } = require('express');
const { body, query } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');
const controller = require('./controller');
const validator = require('../../utils/validator');
const auth = require('../../utils/auth');

const router = new Router();
// Add and get all product
router
  .route('/')
  .post(
    [
      [
        body('title')
          .trim()
          .exists(),
        body('info').exists(),
        body('price').exists(),
        body('salePrice').exists().isFloat(),
        body('sellerId').exists(),
        body('discount'),
        validator
      ],
      auth.runPolicies.bind(['isAdmin', 'isSeller'])
    ],
    (...args) => controller.addProduct(...args)
  )
  .get(
    [
      query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Invalid offset'),
      query('limit')
        .optional()
        .isInt({ min: 0, max: 20 })
        .withMessage('Invalid limit not greater than 20'),
      sanitizeQuery('offset').toInt(),
      sanitizeQuery('limit').toInt(),
      validator
    ],
    (...args) => controller.getProducts(...args)
  );

// delete update and get product by id
router
  .route('/:productId')
  .put(
    [
      [body('title').trim(), body('info').trim(), body('price'), validator],
      auth.runPolicies.bind(['isAdmin', 'isSeller'])
    ],
    (...args) => controller.updateProduct(...args)
  )
  .delete(auth.runPolicies.bind(['isAdmin', 'isSeller']), (...args) => controller.deleteProduct(...args))
  .get((...args) => controller.getProduct(...args));

// add and get product image
router
  .route('/Image/:productId')
  .post(auth.runPolicies.bind(['isAdmin', 'isSeller']), (...args) => controller.addImage(...args))
  .get((...args) => controller.getProductsImage(...args));

// get product image by id
router
  .route('/Image/getById/:id')
  .get((...args) => controller.getProductImage(...args))
  .delete(auth.runPolicies.bind(['isAdmin', 'isSeller']), (...args) => controller.deleteProductImage(...args));

router
  .route('/LikeOrDislike')
  .post(auth.runPolicies.bind(['isBuyer', 'isSeller']), (...args) => controller.like(...args));
router.route('/Featured/Product').get((...args) => controller.getFeaturedProduct(...args));

// Get Product By Category ID
router.route('/Category/:categoryId').get(
  [
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Invalid offset'),
    query('limit')
      .optional()
      .isInt({ min: 0, max: 20 })
      .withMessage('Invalid limit not greater than 20'),
    sanitizeQuery('offset').toInt(),
    sanitizeQuery('limit').toInt(),
    validator
  ],
  (...args) => controller.getProductByCategoryId(...args)
);
// Get Product By Category ID
router.route('/Search/:title').get((...args) => controller.search(...args));
router.route('/Cart/ByIds').post((...args) => controller.getProductByIds(...args));
router.route('/Own/Products').get(
  [
    [
      query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Invalid offset'),
      query('limit')
        .optional()
        .isInt({ min: 0, max: 20 })
        .withMessage('Invalid limit not greater than 20'),
      sanitizeQuery('offset').toInt(),
      sanitizeQuery('limit').toInt(),
      validator
    ],
    auth.runPolicies.bind(['isAuthenticated'])
  ],
  (...args) => controller.getOwnProducts(...args)
);
module.exports = router;

const { Router } = require('express');
const { body } = require('express-validator/check');
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
        body('name')
          .trim()
          .exists(),
        body('type')
          .trim()
          .exists(),
        validator
      ],
      authUtils.runPolicies.bind(['isAdmin'])
    ],
    (...args) => controller.addCategory(...args)
  )
  .get((...args) => controller.getCategories(...args));

// delete update and get category by id
router
  .route('/:categoryId')
  .put(
    [
      [
        body('name')
          .trim()
          .optional(),
        body('type')
          .trim()
          .optional(),
        validator
      ],
      authUtils.runPolicies.bind(['isAdmin'])
    ],
    (...args) => controller.updateCategory(...args)
  )
  .delete(authUtils.runPolicies.bind(['isAdmin']), (...args) => controller.deleteCategory(...args))
  .get((...args) => controller.getCategory(...args));

// add and get category image
router
  .route('/Image/:categoryId')
  .post(authUtils.runPolicies.bind(['isAdmin']), (...args) => controller.addImage(...args))
  .get(authUtils.runPolicies.bind(['isAuthenticated']), (...args) => controller.getCategoriesImage(...args));

// get product category by id
router
  .route('/Image/getById/:id')
  .get(authUtils.runPolicies.bind(['isAdmin']), (...args) => controller.getCategoryImage(...args))
  .delete(authUtils.runPolicies.bind(['isAdmin']), (...args) => controller.deleteCategoryImage(...args));

// get featured category with image
router.route('/Featured/Category').get((...args) => controller.getFeaturedCategory(...args));

// update category logo
router
  .route('/Logo/:categoryId')
  .post(authUtils.runPolicies.bind(['isAdmin']), (...args) => controller.addLogo(...args));

module.exports = router;

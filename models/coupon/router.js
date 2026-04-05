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
        body('code')
          .trim()
          .exists(),
        body('maxAmount')
          .exists()
          .toFloat(),
        body('type').trim(),
        body('percentage')
        .exists()
        .isInt(),
        validator
      ],
      authUtils.runPolicies.bind(['isAdmin'])
    ],
    (...args) => controller.addCoupon(...args)
  )
  .get((...args) => controller.getCoupons(...args));

  router
  .route('/:couponId').delete((...args) => controller.deleteCoupon(...args));

// delete update and get coupon by id
router
  .route('/:couponId')
  .put(
    [
      [
        body('name')
          .trim()
          .optional(),
        body('type')
          .trim()
          .optional(),
        body('isDisabled')
          .isBoolean()
          .optional(),
          body('maxAmount')
          .optional()
          .toFloat(),
          body('percentage')
          .optional()
          .isInt(),
        validator
      ],
      authUtils.runPolicies.bind(['isAdmin'])
    ],
    (...args) => controller.updateCoupon(...args)
  )
  .delete(authUtils.runPolicies.bind(['isAdmin']), (...args) => controller.deleteCoupon(...args))
  .get((...args) => controller.getCoupon(...args));

// add coupon mapping

router
  .route('/Category/Mapping')
  .post(
    [
      [
        body('couponId')
          .trim()
          .exists(),
        body('categoryId')
          .trim()
          .exists(),
        body('validTill')
          .isISO8601()
          .exists()
          .withMessage('invalid date send iso format'),
        body('validFrom')
          .isISO8601()
          .exists()
          .withMessage('invalid date send iso format'),
        body('minCartValue')
          .exists()
          .toFloat(),
        validator
      ],
      authUtils.runPolicies.bind(['isAdmin'])
    ],
    (...args) => controller.mapCoupon(...args)
  )
  .get((...args) => controller.getMapping(...args));;

  router
  .route('/Category/Mapping/:mappingId')
  .put(
    [
      [
        body('validTill')
          .isISO8601()
          .optional()
          .withMessage('invalid date send iso format'),
        body('validFrom')
          .isISO8601()
          .optional()
          .withMessage('invalid date send iso format'),
        body('minCartValue')
          .optional()
          .toFloat(),
        validator
      ],
      authUtils.runPolicies.bind(['isAdmin'])
    ],
    (...args) => controller.updateMapping(...args)
  );

module.exports = router;

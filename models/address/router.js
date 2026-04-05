const { Router } = require('express');
const { body } = require('express-validator/check');
const controller = require('./controller');
const validator = require('../../utils/validator');
const validation = require('../../utils/validation');
const auth = require('../../utils/auth');

const router = new Router();

// SignUp, get Profile, updated profile and logout
router
  .route('/')
  .post(
    [
      [
        body('name')
          .exists()
          .trim()
          .withMessage('Invalid Name'),
        body('countryId')
          .exists()
          .trim()
          .withMessage('Invalid Name'),
        body('address')
          .exists()
          .trim()
          .withMessage('Invalid address'),
        body('city')
          .exists()
          .trim()
          .withMessage('Invalid city'),
        body('state')
          .exists()
          .trim()
          .withMessage('Invalid state'),
        body('landmark')
          .optional()
          .trim()
          .withMessage('Invalid state'),
        body('pinCode')
          .exists()
          .isLength({ min: 4, max: 8 })
          .withMessage('Invalid pinCode'),
        body('number')
          .exists()
          .custom(validation.isValidNumber)
          .withMessage('Invalid Number Please try again with you country code'),
        body('alternateNumber')
          .optional()
          .custom(validation.isValidNumber)
          .withMessage('Invalid Number Please try again with you country code'),
        body('type')
          .exists()
          .isIn(['HOME', 'WORK', 'OTHER']),
        validator
      ],
      auth.runPolicies.bind(['isBuyer'])
    ],
    (...args) => controller.add(...args)
  )
  .get(auth.runPolicies.bind(['isBuyer']), (...args) => controller.getAll(...args));

router
  .route('/:addressId')
  .put(
    [
      [
        body('name')
          .optional()
          .trim()
          .withMessage('Invalid Name'),
        body('countryId')
          .optional()
          .trim()
          .withMessage('Invalid Name'),
        body('address')
          .optional()
          .trim()
          .withMessage('Invalid address'),
        body('city')
          .optional()
          .trim()
          .withMessage('Invalid city'),
        body('state')
          .optional()
          .trim()
          .withMessage('Invalid state'),
        body('landmark')
          .optional()
          .trim()
          .withMessage('Invalid state'),
        body('pinCode')
          .optional()
          .isLength({ min: 4, max: 8 })
          .withMessage('Invalid pinCode min length is 4 and max is 8'),
        body('number')
          .optional()
          .custom(validation.isValidNumber)
          .withMessage('Invalid Number Please try again with you country code'),
        body('alternateNumber')
          .optional()
          .custom(validation.isValidNumber)
          .withMessage('Invalid Number Please try again with you country code'),
        body('type')
          .optional()
          .isIn(['HOME', 'WORK', 'OTHER']),
        validator
      ],
      auth.runPolicies.bind(['isBuyer'])
    ],
    (...args) => controller.update(...args)
  )
  .get(auth.runPolicies.bind(['isBuyer']), (...args) => controller.get(...args))
  .delete(auth.runPolicies.bind(['isBuyer']), (...args) => controller.delete(...args));

module.exports = router;

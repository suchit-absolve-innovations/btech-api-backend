const { Router } = require('express');
const { body } = require('express-validator/check');
const router = new Router();

const controller = require('./controller');

router.route('/Login').post(
  [
    body('grant_type')
      .exists()
      .isIn(['password', 'refresh_token', 'fb_auth', 'google_auth'])
      .withMessage('Invalid grantType'),
    body('deviceType')
      .optional()
      .isIn(['android', 'ios', 'web'])
      .withMessage('Invalid deviceType'),
    body('pushToken').optional()
  ],
  (...args) => controller.obtainToken(...args)
);
router.route('/RefreshToken').post((...args) => controller.obtainToken(...args));

module.exports = router;

const { Router } = require('express');
const { body, query } = require('express-validator/check');
const { sanitizeQuery } = require('express-validator/filter');
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
      body('firstName')
        .exists()
        .trim()
        .withMessage('Invalid Name'),
      body('lastName')
        .optional()
        .trim(),
      body('email')
        .exists()
        .isEmail()
        .trim()
        .withMessage('Invalid Email'),
      body('password')
        .exists()
        .isLength({ min: 6, max: 30 })
        .withMessage('Invalid Password'),
      body('contactNumber')
        .optional()
        .custom(validation.isValidNumber)
        .withMessage('Invalid Number Please try again with you country code'),
      body('role')
        .exists()
        .isIn(['buyer', 'seller']),
      validator
    ],
    (...args) => controller.signUp(...args)
  )
  .get(auth.runPolicies.bind(['isAuthenticated']), (...args) => controller.me(...args))
  .put(
    [
      [
        body('username').optional(),
        body('firstName')
          .optional()
          .trim(),
        body('lastName')
          .optional()
          .trim(),
        body('email')
          .optional()
          .isEmail()
          .withMessage('Not a valid email'),
        body('contactNumber')
          .optional()
          .custom(validation.isValidNumber)
          .withMessage('invalid number'),
        validator
      ],
      auth.runPolicies.bind(['isAuthenticated'])
    ],
    (...args) => controller.updateProfile(...args)
  )
  .delete(auth.runPolicies.bind(['isAuthenticated']), (...args) => controller.logout(...args));

// Verify Email
router.route('/VerifyEmail').post((...args) => controller.verifyEmail(...args));

// Resend Verify Email
router.route('/ResendVerifyEmail').post(
  [
    body('email')
      .optional()
      .isEmail(),
    validator
  ],
  (...args) => controller.resendVerifyEmail(...args)
);

// Forgot Password
router.route('/ForgotPassword').put(
  [
    body('email')
      .exists()
      .isEmail(),
    validator
  ],
  (...args) => controller.forgotPassword(...args)
);

// Reset Password
router.route('/ResetPassword').put(
  [
    body('password')
      .exists()
      .isLength({ min: 6, max: 30 }),
    body('token').exists(),
    body('id').exists()
  ],
  (...args) => controller.resetPassword(...args)
);

// change password
router.route('/ChangePassword').put(
  [
    [
      body('newPassword')
        .exists()
        .isLength({ min: 6, max: 30 })
        .withMessage('invalid password'),
      body('oldPassword').exists(),
      validator
    ],
    auth.runPolicies.bind(['isAuthenticated'])
  ],
  (...args) => controller.changePassword(...args)
);

// get all country codes
router.route('/CountryCode').get((...args) => controller.getAllCountryCode(...args));

// Add and get all Banner
router
  .route('/Banner')
  .post(auth.runPolicies.bind(['isAdmin']), (...args) => controller.addBanner(...args))
  .get((...args) => controller.getBanners(...args));

// get banner by id
router
  .route('/Banner/:bannerId')
  .get((...args) => controller.getBanner(...args))
  .delete((...args) => controller.deleteBanner(...args));

// stats
router.route('/Stats').get(auth.runPolicies.bind(['isAdmin']), (...args) => controller.stats(...args));

// get states by country id
router.route('/States/:countryId').get((...args) => controller.states(...args));

router.route('/All').get(
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
      query('role')
        .optional()
        .isString()
        .isIn(['seller', 'buyer', 'admin'])
        .withMessage('Invalid offset'),
      validator
    ],
    auth.runPolicies.bind(['isAdmin'])
  ],
  (...args) => controller.getMembers(...args)
);

router.route('/Seller').get(
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
    auth.runPolicies.bind(['isAdmin'])
  ],
  (...args) => controller.getSeller(...args)
);

// disable or enable member
router.route('/DisableOrEnable').post(
  [
    [
      body('action')
        .exists()
        .isString()
        .isIn(['enable', 'disable'])
        .withMessage('Invalid action'),
      body('memberId').exists(),
      validator
    ],
    auth.runPolicies.bind(['isAdmin'])
  ],
  (...args) => controller.status(...args)
);

// search member by name
router.route('/Search').get(
  [
    [
      query('name')
        .exists()
        .isString(),
      validator
    ],
    auth.runPolicies.bind(['isAdmin'])
  ],
  (...args) => controller.search(...args)
);

// add seller info
router
  .route('/SellerInfo')
  .post(auth.runPolicies.bind(['isSeller']), (...args) => controller.sellerInfo(...args))
  .put([auth.runPolicies.bind(['isSeller'])], (...args) => controller.updateSellerInfo(...args));

router
  .route('/Admin/SellerInfo/:sellerId')
  .put([auth.runPolicies.bind(['isAdmin'])], (...args) => controller.approveSellerInfo(...args));

router
  .route('/SellerStats')
  .get(auth.runPolicies.bind(['isSeller']), (...args) => controller.sellerStats(...args));

  // get device token
  router
  .route('/DeviceToken')
  .get(auth.runPolicies.bind(['isAuthenticated']), (...args) => controller.deviceToken(...args));

    // get device token
    router
    .route('/signInWithApple')
    .post((...args) => controller.signInWithApple(...args));
  
module.exports = router;

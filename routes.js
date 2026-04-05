const { Router } = require('express');
const config = require('config');
const accessToken = require('./models/accessToken/router');
const member = require('./models/member/router');
const category = require('./models/category/router');
const product = require('./models/product/router');
const address = require('./models/address/router');
const cart = require('./models/cart/router');
const order = require('./models/order/router');
const transaction = require('./models/transaction/router');
const coupon = require('./models/coupon/router');
const router = new Router();
const version = config.get('version');

// swagger dynamic
const swaggerDef = require('./swagger/swagger.json');
swaggerDef.host = `${config.get('swaggerHost')}`;
swaggerDef.basePath = `/${config.get('version')}`;

router.route('/swagger').get((req, res) => res.json(swaggerDef));

router.route('/').get((req, res) => {
  res.json({ message: 'WELCOME TO B-Technologies!' });
});

router.route('/health').get((req, res) => {
  const response = {
    status: global.dbReady ? 'ok' : 'degraded',
    dbReady: Boolean(global.dbReady),
    hasDbBootError: Boolean(global.dbBootError)
  };

  if (global.dbReady) {
    return res.status(200).json(response);
  }

  return res.status(200).json(response);
});

router.use(`/${version}/Member`, member);
router.use(`/${version}/oAuth`, accessToken);
router.use(`/${version}/Category`, category);
router.use(`/${version}/Product`, product);
router.use(`/${version}/Address`, address);
router.use(`/${version}/Cart`, cart);
router.use(`/${version}/Order`, order);
router.use(`/${version}/Transaction`, transaction);
router.use(`/${version}/Coupon`, coupon);

module.exports = router;

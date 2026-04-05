const Facade = require('../../lib/facade');
const couponSchema = require('./schema');

class CouponFacade extends Facade {}

module.exports = new CouponFacade(couponSchema);

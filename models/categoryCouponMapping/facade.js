const Facade = require('../../lib/facade');
const categoryCouponMappingSchema = require('./schema');
class CategoryCouponMappingFacade extends Facade {}

module.exports = new CategoryCouponMappingFacade(categoryCouponMappingSchema);

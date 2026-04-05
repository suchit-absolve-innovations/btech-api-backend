const Facade = require('../../lib/facade');
const sellerInfoSchema = require('./schema');
class SellerInfoFacade extends Facade {}

module.exports = new SellerInfoFacade(sellerInfoSchema);

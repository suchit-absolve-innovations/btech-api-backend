const Facade = require('../../lib/facade');
const cartSchema = require('./schema');
class CartFacade extends Facade {}

module.exports = new CartFacade(cartSchema);

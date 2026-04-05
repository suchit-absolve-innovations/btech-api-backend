const Facade = require('../../lib/facade');
const orderSchema = require('./schema');
class OrderFacade extends Facade {}

module.exports = new OrderFacade(orderSchema);

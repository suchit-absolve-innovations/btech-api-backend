const Facade = require('../../lib/facade');
const addressSchema = require('./schema');
class AddressFacade extends Facade {}

module.exports = new AddressFacade(addressSchema);

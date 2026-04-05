const Facade = require('../../lib/facade');
const transactionSchema = require('./schema');
class TransactionFacade extends Facade {}

module.exports = new TransactionFacade(transactionSchema);

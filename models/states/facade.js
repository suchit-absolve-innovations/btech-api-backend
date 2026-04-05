const Facade = require('../../lib/facade');
const stateSchema = require('./schema');
class StateFacade extends Facade {}

module.exports = new StateFacade(stateSchema);

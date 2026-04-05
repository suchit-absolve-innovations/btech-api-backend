const Facade = require('../../lib/facade');
const roleMappingSchema = require('./schema');
class RoleMappingFacade extends Facade {}

module.exports = new RoleMappingFacade(roleMappingSchema);

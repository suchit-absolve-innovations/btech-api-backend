const Facade = require('../../lib/facade');
const userSchema = require('./schema');
class MemberFacade extends Facade {}

module.exports = new MemberFacade(userSchema);

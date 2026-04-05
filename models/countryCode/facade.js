const Facade = require('../../lib/facade');
const countryCodeSchema = require('./schema');
class CountryCodeFacade extends Facade {}

module.exports = new CountryCodeFacade(countryCodeSchema);

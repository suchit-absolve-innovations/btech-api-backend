const Facade = require('../../lib/facade');
const productLikeSchema = require('./schema');

class ProductLikeFacade extends Facade {}

module.exports = new ProductLikeFacade(productLikeSchema);

const _ = require('lodash');
const cartFacade = require('./facade');
const productFacade = require('../product/facade');

class MemberController {
  // Add product to cart
  async add(req, res, next) {
    const { productId, quantity } = req.body;
    let product;
    let cartProduct;
    try {
      product = await productFacade.findOne({ where: { id: productId } });
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 204;
      return next(err);
    }
    const productQuantity = JSON.parse(product.info.quantity);
    if (quantity > productQuantity) {
      const err = new Error('Product Out of stock');
      err.statusCode = 400;
      return next(err);
    }
    try {
      cartProduct = await cartFacade.findOne({ where: { productId, memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    if (cartProduct) {
      const totalQuantity = Number(cartProduct.quantity) + Number(quantity);
      if (quantity > productQuantity) {
        const err = new Error('Product Out of stock');
        err.statusCode = 400;
        return next(err);
      }
      cartProduct.quantity = totalQuantity;
      cartProduct.amount = Number(cartProduct.quantity) * Number(product.salePrice);
      try {
        await cartProduct.save();
      } catch (err) {
        return next(err);
      }
    } else {
      try {
        cartProduct = await cartFacade.create({
          productId,
          quantity,
          categoryId: product.categoryId,
          memberId: req.member.id,
          amount: Number(quantity) * Number(product.salePrice)
        });
      } catch (err) {
        return next(err);
      }
    }

    res.send(cartProduct);
  }

  // get all products that are in cart
  async get(req, res, next) {
    let carts;

    try {
      carts = await cartFacade.findAll({
        where: { memberId: req.member.id },
        include: [{ association: 'product', as: 'product', include: ['images'] }]
      });
    } catch (err) {
      return next(err);
    }
    for (const cart of carts) {
      cart.dataValues.product.dataValues.images = cart.product.images[0] ? cart.product.images[0] : null;
    }
    res.send(carts);
  }

  // get count of cart
  async getCount(req, res, next) {
    let count;

    try {
      count = await cartFacade.count({
        where: { memberId: req.member.id }
      });
    } catch (err) {
      return next(err);
    }
    res.send(count);
  }

  async update(req, res, next) {
    const { productId } = req.params;
    const { quantity } = req.body;
    let product;
    let cartProduct;
    try {
      product = await productFacade.findOne({ where: { id: productId } });
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 204;
      return next(err);
    }
    const productQuantity = JSON.parse(product.info.quantity);
    if (quantity > productQuantity) {
      const err = new Error('Product Out of stock');
      err.statusCode = 400;
      return next(err);
    }
    try {
      cartProduct = await cartFacade.findOne({ where: { productId, memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    if (cartProduct) {
      cartProduct.quantity = Number(quantity);
      cartProduct.quantity = quantity;
      cartProduct.amount = Number(cartProduct.quantity) * Number(product.salePrice);
      try {
        await cartProduct.save();
      } catch (err) {
        return next(err);
      }
    }
    res.send(cartProduct);
  }

  // delete product from cart
  async delete(req, res, next) {
    const { productId } = req.params;
    try {
      await cartFacade.destroy({ where: { productId, memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'product removed from the cart' });
  }

  // delete all products from cart
  async empty(req, res, next) {
    try {
      await cartFacade.destroy({ where: { memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'all products removed from the cart' });
  }

  // Add array product to cart
  async addOfflineCart(req, res, next) {
    const { products } = req.body;
    if (!_.isArray(products)) {
      const err = new Error('Array of Products is required');
      err.statusCode = 400;
      return next(err);
    }
    let product;
    let cartProduct;
    for (const p of products) {
      try {
        product = await productFacade.findOne({ where: { id: p.productId } });
      } catch (err) {
        return next(err);
      }
      if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 204;
        return next(err);
      }
      const productQuantity = JSON.parse(product.info.quantity);
      if (p.quantity > productQuantity) continue;
      try {
        cartProduct = await cartFacade.findOne({ where: { productId: p.productId, memberId: req.member.id } });
      } catch (err) {
        return next(err);
      }
      if (cartProduct) {
        const totalQuantity = Number(cartProduct.quantity) + Number(p.quantity);
        if (totalQuantity > productQuantity) continue;
        cartProduct.quantity = totalQuantity;
        cartProduct.amount = Number(totalQuantity) * Number(product.salePrice);
        try {
          await cartProduct.save();
        } catch (err) {
          return next(err);
        }
      } else {
        try {
          cartProduct = await cartFacade.create({
            productId: p.productId,
            quantity: p.quantity,
            memberId: req.member.id,
            amount: Number(p.quantity) * Number(product.salePrice)
          });
        } catch (err) {
          return next(err);
        }
      }
    }

    res.send(cartProduct);
  }
}

module.exports = new MemberController(cartFacade);

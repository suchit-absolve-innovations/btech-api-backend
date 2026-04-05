const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('config');
const multer = require('multer');
const shortId = require('shortid');
const productFacade = require('./facade');
const productImageFacade = require('../productImage/facade');
const authUtils = require('../../utils/auth');
const productLikeFacade = require('../productLike/facade');
const roleMappingFacade = require('../roleMapping/facade');

const fileFilter = (req, file, cb) => {
  if (_.includes(config.get('allowedImagesTypes'), file.mimetype)) return cb(null, true);
  req.mimeError = true;
  cb(null, false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/productImage');
  },
  filename: (req, file, cb) => {
    const origFilename = file.originalname;
    const parts = origFilename.split('.');
    const extension = parts[parts.length - 1];
    const id = shortId.generate();
    const newFilename = `${id}.${extension}`;
    req.pictureId = id;
    cb(null, newFilename);
  }
});
const multerConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.get('maxPictureSize') }
});
const uploadImage = Promise.promisify(multerConfig.array('image', 5));

class ProductController {
  // Add Product
  async addProduct(req, res, next) {
    const { title, price, categoryId, salePrice, discount, sellerId, additionalDescription } = req.body;
    const { member } = req;
    if (price < salePrice) {
      const error = new Error('Price should not be less than sale price');
      error.statusCode = 400;
      return next(error);
    }
    const productModel = {
      color: null,
      description: null,
      quantity: null,
      weight: null,
      rating: null
    };
    let product;
    let seller;
    for (const key in productModel) {
      productModel[key] = req.body.info[key];
    }
    const obj = _.pickBy(productModel, h => !_.isUndefined(h));
    if (!obj.quantity) {
      const err = new Error('Quantity is required');
      err.statusCode = 400;
      return next(err);
    }
    try {
      seller = await roleMappingFacade.findOne({
        where: { memberId: sellerId, roleId: 'seller' },
        include: [{ association: 'member', include: ['sellerInfo'] }]
      });
    } catch (err) {
      return next(err);
    }
    if (!seller) {
      const err = new Error('Not a valid seller');
      err.statusCode = 403;
      return next(err);
    }
    if (!seller.member.status) {
      const err = new Error('Seller is disabled please contact admin');
      err.statusCode = 403;
      return next(err);
    }
    if (!seller.member.sellerInfo) {
      const err = new Error('This seller has not updated is company info');
      err.statusCode = 403;
      return next(err);
    }
    try {
      product = await productFacade.create({
        title,
        price,
        categoryId,
        salePrice,
        discount,
        info: obj,
        memberId: member.id,
        sellerId: seller.memberId,
        additionalDescription
      });
    } catch (err) {
      return next(err);
    }
    res.send(product);
  }

  // Get All products open api
  async getProducts(req, res, next) {
    let products = [];
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    let count;
    try {
      products = await productFacade.findAll({
        offset,
        limit,
        include: [{ association: 'seller', include: ['sellerInfo'] }, 'images', 'likes', 'category'],
        order: [['updatedAt', 'DESC']]
      });
    } catch (err) {
      return next(err);
    }
    try {
      count = await productFacade.count({});
    } catch (err) {
      return next(err);
    }
    for (const product of products) {
      let sellerName;
      product.dataValues.categoryName = product.category.name;
      if (product.seller) {
        sellerName = product.seller.sellerInfo.companyName;
      }
      product.dataValues.sellerName = sellerName;
      delete product.dataValues.category;
      delete product.dataValues.seller;
    }
    res.send({ totalCount: count.count, products });
  }

  // Get Own Product
  async getOwnProducts(req, res, next) {
    let products = [];
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    let count;
    try {
      products = await productFacade.findAll({
        offset,
        limit,
        include: [{ association: 'seller', include: ['sellerInfo'] }, 'images', 'likes', 'category'],
        where: { [Op.or]: [{ memberId: req.member.id }, { sellerId: req.member.id }] },
        order: [['createdAt', 'DESC']]
      });
    } catch (err) {
      return next(err);
    }
    for (const product of products) {
      let sellerName;
      product.dataValues.categoryName = product.category.name;
      if (product.seller) {
        sellerName = product.seller.sellerInfo.companyName;
      }
      product.dataValues.sellerName = sellerName;
      delete product.dataValues.category;
      delete product.dataValues.seller;
    }
    try {
      count = await productFacade.count({
        where: { [Op.or]: [{ memberId: req.member.id }, { sellerId: req.member.id }] }
      });
    } catch (err) {
      return next(err);
    }
    res.send({ totalCount: count.count, products });
  }

  // Get Products by ID open api
  async getProduct(req, res, next) {
    const { productId } = req.params;

    let products;
    try {
      products = await productFacade.findAll({
        where: { id: productId },
        include: [{ association: 'seller', include: ['sellerInfo'] }, 'images', 'likes', 'category']
      });
    } catch (err) {
      return next(err);
    }
    if (_.isEmpty(products)) {
      const err = new Error('No Product Found');
      err.statusCode = 204;
      return next(err);
    }
    for (const product of products) {
      let sellerName;

      product.dataValues.categoryName = product.category.name;
      if (product.seller) {
        sellerName = product.seller.sellerInfo.companyName;
      }
      product.dataValues.sellerName = sellerName;
      delete product.dataValues.category;
      delete product.dataValues.seller;
    }
    res.send({ totalCount: 1, products });
  }

  // update product by ID
  async updateProduct(req, res, next) {
    const productModel = {
      color: null,
      description: null,
      quantity: null,
      weight: null,
      rating: null
    };
    const { productId } = req.params;
    const { title, price, categoryId, salePrice, discount, additionalDescription } = req.body;
    let product;
    let info;
    let where = { id: productId, memberId: req.member.id };
    if (req.roles.includes('admin') && req.isAdmin) where = { id: productId };
    try {
      product = await productFacade.findOne({ where });
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const err = new Error('No Product Found');
      err.statusCode = 204;
      return next(err);
    }
    if (req.body.info) {
      if (!_.isObject(req.body.info)) {
        info = JSON.parse(req.body.info);
      } else {
        ({ info } = req.body);
      }
    }
    for (const key in productModel) {
      if (!info || !info[key]) continue;
      productModel[key] = info[key];
    }
    const obj = _.pickBy(productModel, h => {
      if (!_.isUndefined(h) || h) {
        return h;
      }
    });
    try {
      await productFacade.update(
        { info: obj, title, price, categoryId, salePrice, discount, additionalDescription },
        { where: { id: product.id } }
      );
    } catch (err) {
      return next(err);
    }
    res.send(product);
  }

  // Delete Categories by ID
  async deleteProduct(req, res, next) {
    const { productId } = req.params;
    let product;
    let where = { id: productId, memberId: req.member.id };
    if (req.roles.includes('admin') && req.isAdmin) where = { id: productId };
    try {
      product = await productFacade.findOne({ where, include: ['images'] });
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const err = new Error('No Product Found');
      err.statusCode = 204;
      return next(err);
    }
    for (const image of product.images) {
      try {
        await image.destroy();
      } catch (err) {
        return next(err);
      }
      try {
        await authUtils.deleteImage(image.path);
      } catch (err) {
        return next(err);
      }
    }
    try {
      await product.destroy();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'successfully deleted' });
  }

  // upload product image
  async addImage(req, res, next) {
    let image;
    try {
      await uploadImage(req, res);
    } catch (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 422;
        return next(err);
      }
      return next(err);
    }
    if (req.mimeError) {
      const error = new Error('Invalid File Type');
      error.statusCode = 422;
      return next(error);
    }
    if (_.isEmpty(req.files)) {
      const error = new Error('File is Required');
      error.statusCode = 422;
      return next(error);
    }
    let product;
    try {
      product = await productFacade.findOne({ where: { id: req.params.productId } });
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const err = new Error('No Product Found');
      err.statusCode = 204;
      for (const file of req.files) {
        await fs.unlinkAsync(file.path);
      }
      return next(err);
    }

    for (const file of req.files) {
      try {
        await authUtils.imageCompress('static/productImage', file.path);
      } catch (err) {
        return next(err);
      }
      try {
        image = await productImageFacade.create({
          path: file.path,
          memberId: req.member.id,
          productId: req.params.productId,
          isFeatured: req.body.isFeatured
        });
      } catch (e) {
        await fs.unlinkAsync(file.path);
        return next(e);
      }
    }

    res.send(image);
  }

  // get product image
  async getProductImage(req, res, next) {
    const { id } = req.params;
    let image;
    try {
      image = await productImageFacade.findOne({ where: { id } });
    } catch (err) {
      return next(err);
    }
    res.send(image);
  }

  // delete image
  async deleteProductImage(req, res, next) {
    const { id } = req.params;
    let image;
    try {
      image = await productImageFacade.findOne({ where: { id } });
    } catch (err) {
      return next(err);
    }
    if (!image) {
      const err = new Error('No image Found');
      err.statusCode = 204;
      return next(err);
    }
    try {
      await authUtils.deleteImage(image.path);
    } catch (err) {
      return next(err);
    }
    try {
      await image.destroy();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Image Deleted' });
  }

  // get all product image
  async getProductsImage(req, res, next) {
    const { productId } = req.params;
    let images;
    try {
      images = await productImageFacade.findAll({ where: { productId } });
    } catch (err) {
      return next(err);
    }
    res.send(images);
  }

  // like or dislike
  async like(req, res, next) {
    const { productId } = req.query;
    let postLike;
    let product;
    try {
      product = await productFacade.findOne({ where: { id: productId } });
    } catch (err) {
      return next(err);
    }
    if (!product) {
      const err = new Error('No Product Found');
      err.statusCode = 204;
      return next(err);
    }

    try {
      postLike = await productLikeFacade.findOne({ where: { productId, memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    if (!postLike) {
      try {
        postLike = await productLikeFacade.create({ productId, memberId: req.member.id });
      } catch (err) {
        return next(err);
      }
      try {
        let like = Number(product.totalLike);
        like += 1;
        product.totalLike = like;
        await product.save();
      } catch (err) {
        return next(err);
      }
    } else {
      try {
        await productLikeFacade.destroy({ where: { productId, memberId: req.member.id } });
      } catch (err) {
        return next(err);
      }
      postLike = { message: 'Disliked' };
      try {
        if (product.totalLike > 0) {
          let like = Number(product.totalLike);
          like -= 1;
          product.totalLike = like;
          await product.save();
        }
      } catch (err) {
        return next(err);
      }
    }
    res.send(postLike);
  }

  // get featured product with image
  async getFeaturedProduct(req, res, next) {
    let products;

    try {
      products = await productFacade.findAll({
        order: [['totalLike', 'DESC']],
        limit: 6,
        include: ['category', 'images']
      });
    } catch (err) {
      return next(err);
    }
    res.send({ totalCount: products.length, products });
  }

  // get product by categoryId with image
  async getProductByCategoryId(req, res, next) {
    const { categoryId } = req.params;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 20;
    let products;
    let count;
    try {
      products = await productFacade.findAll({ where: { categoryId }, offset, limit, include: ['images'] });
    } catch (err) {
      return next(err);
    }
    try {
      count = await productFacade.count({ where: { categoryId } });
    } catch (err) {
      return next(err);
    }

    res.send({ totalCount: count.count, products });
  }

  // search product by title with image
  async search(req, res, next) {
    const { title } = req.params;
    const limit = 10;
    let products;
    try {
      products = await productFacade.findAll({
        where: { title: { [Op.like]: `%${title}%` } },
        limit,
        include: ['images', 'likes']
      });
    } catch (err) {
      return next(err);
    }

    res.send({ totalCount: products.length, products });
  }

  // get products by ids including category and image
  async getProductByIds(req, res, next) {
    const { productIds } = req.body;
    if (!_.isArray(productIds)) {
      const err = new Error('Array of product ids required');
      err.statusCode = 400;
      return next(err);
    }
    if (productIds.length > 500) {
      const err = new Error('Max 500 ids are allowed');
      err.statusCode = 400;
      return next(err);
    }
    let products;
    try {
      products = await productFacade.findAll({
        where: { id: { [Op.in]: productIds } },
        include: [{ association: 'seller', include: ['sellerInfo'] }, 'images', 'likes', 'category']
      });
    } catch (err) {
      return next(err);
    }
    for (const product of products) {
      let sellerName;

      product.dataValues.categoryName = product.category.name;
      if (product.seller) {
        sellerName = product.seller.sellerInfo.companyName;
      }
      product.dataValues.sellerName = sellerName;
      delete product.dataValues.category;
      delete product.dataValues.seller;
    }

    res.send({ totalCount: products.length, products });
  }
}

module.exports = new ProductController(productFacade);

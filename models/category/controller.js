const _ = require('lodash');
const Promise = require('bluebird');
const config = require('config');
const multer = require('multer');
const shortId = require('shortid');
const fs = Promise.promisifyAll(require('fs'));
const categoryFacade = require('./facade');
const imageFacade = require('../categoryImage/facade');
const authUtils = require('../../utils/auth');
const productFacade = require('../product/facade');
const bannerFacade = require('../banner/facade');
const productImageFacade = require('../productImage/facade');

const fileFilter = (req, file, cb) => {
  if (_.includes(config.get('allowedImagesTypes'), file.mimetype)) return cb(null, true);
  req.mimeError = true;
  cb(null, false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/categoryImage');
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
const uploadLogo = Promise.promisify(multerConfig.single('logo'));

class MemberController {
  // Add Category
  async addCategory(req, res, next) {
    const { name, type, isNavigation } = req.body;
    let category;
    try {
      category = await categoryFacade.create({ name, type, isNavigation });
    } catch (err) {
      return next(err);
    }
    res.send(category);
  }

  // Get All Categories
  async getCategories(req, res, next) {
    let categories;
    try {
      categories = await categoryFacade.findAll({ include: ['images'] });
    } catch (err) {
      return next(err);
    }
    res.send(categories);
  }

  // Get Categories by ID
  async getCategory(req, res, next) {
    const { categoryId } = req.params;
    let category;
    try {
      category = await categoryFacade.findOne({ where: { id: categoryId }, include: ['images'] });
    } catch (err) {
      return next(err);
    }
    if (!category) {
      const err = new Error('No Category Found');
      err.statusCode = 204;
      return next(err);
    }
    res.send(category);
  }

  // Delete Categories by ID
  async updateCategory(req, res, next) {
    const { categoryId } = req.params;
    const { name, type, isNavigation } = req.body;
    let category;
    try {
      category = await categoryFacade.findOne({ where: { id: categoryId } });
    } catch (err) {
      return next(err);
    }
    if (!category) {
      const err = new Error('No Category Found');
      err.statusCode = 204;
      return next(err);
    }
    category.name = name;
    category.type = type;
    category.isNavigation = isNavigation;
    try {
      await category.save();
    } catch (err) {
      return next(err);
    }
    res.send(category);
  }

  // Delete Categories by ID
  async deleteCategory(req, res, next) {
    const { categoryId } = req.params;
    let category;
    let transaction;
    let products = [];
    let banners = [];
    try {
      category = await categoryFacade.findOne({ where: { id: categoryId }, include: ['images'] });
    } catch (err) {
      return next(err);
    }
    if (!category) {
      const err = new Error('No Category Found');
      err.statusCode = 204;
      return next(err);
    }
    try {
      transaction = await sequelize.transaction();
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
    // delete logo
    if (category.logo) {
      try {
        await authUtils.deleteImage(category.logo);
      } catch (err) {
        await transaction.rollback();
        return next(err);
      }
    }

    try {
      banners = await bannerFacade.findAll({ where: { categoryId } });
    } catch (err) {
      return next(err);
    }
    // delete banner
    for (const banner of banners) {
      try {
        await banner.destroy({ transaction });
      } catch (err) {
        await transaction.rollback();
        return next(err);
      }
      try {
        await authUtils.deleteImage(banner.path);
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    // delete category image
    for (const image of category.images) {
      try {
        await image.destroy({ transaction });
      } catch (err) {
        await transaction.rollback();
        return next(err);
      }
      try {
        await authUtils.deleteImage(image.path);
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    try {
      products = await productFacade.findAll({ where: { categoryId }, include: ['images'] });
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
    // delete product and product image
    if (!_.isEmpty(products)) {
      const images = [];
      const productIds = _.map(products, 'id');
      _.map(products, p => {
        images.push(p.images);
      });
      for (const image of images) {
        const imageIds = _.map(image, 'id');
        try {
          await productImageFacade.destroy({ where: { id: { [Op.in]: imageIds } }, transaction });
        } catch (err) {
          await transaction.rollback();
          return next(err);
        }
        for (const i of image) {
          try {
            await authUtils.deleteImage(i.path);
          } catch (err) {
            console.log(err);
            continue;
          }
        }
      }
      try {
        await productFacade.destroy({ where: { id: { [Op.in]: productIds } }, transaction });
      } catch (err) {
        await transaction.rollback();
        return next(err);
      }
    }
    try {
      await category.destroy({ transaction });
    } catch (err) {
      await transaction.rollback();
      return next(err);
    }
    await transaction.commit();
    res.json({ message: 'successfully deleted' });
  }

  // upload category image
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
    let category;
    try {
      category = await categoryFacade.findOne({ where: { id: req.params.categoryId } });
    } catch (err) {
      return next(err);
    }
    if (!category) {
      const err = new Error('No Category Found');
      err.statusCode = 204;
      for (const file of req.files) {
        await fs.unlinkAsync(file.path);
      }
      return next(err);
    }

    for (const file of req.files) {
      try {
        await authUtils.imageCompress('static/categoryImage', file.path);
      } catch (err) {
        return next(err);
      }
      try {
        image = await imageFacade.create({
          path: file.path,
          memberId: req.member.id,
          categoryId: req.params.categoryId,
          isFeatured: req.body.isFeatured
        });
      } catch (e) {
        await fs.unlinkAsync(file.path);
        return next(e);
      }
    }

    res.send(image);
  }

  // upload category image
  async addLogo(req, res, next) {
    try {
      await uploadLogo(req, res);
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
    if (_.isEmpty(req.file)) {
      const error = new Error('File is Required');
      error.statusCode = 422;
      return next(error);
    }
    let category;
    try {
      category = await categoryFacade.findOne({ where: { id: req.params.categoryId } });
    } catch (err) {
      return next(err);
    }
    if (!category) {
      const err = new Error('No Category Found');
      err.statusCode = 204;
      for (const file of req.files) {
        await fs.unlinkAsync(file.path);
      }
      return next(err);
    }
    if (!req.file) {
      const error = new Error('File is Required');
      error.statusCode = 422;
      return next(error);
    }
    const { path } = req.file;
    try {
      await authUtils.imageCompress('static/categoryImage', path);
    } catch (err) {
      return next(err);
    }
    try {
      await categoryFacade.update(
        {
          logo: path
        },
        { where: { id: req.params.categoryId } }
      );
    } catch (e) {
      await fs.unlinkAsync(path);
      return next(e);
    }

    res.json({ message: 'Image uploaded' });
  }

  // get category image
  async getCategoryImage(req, res, next) {
    const { id } = req.params;
    let image;
    try {
      image = await imageFacade.findOne({ where: { id } });
    } catch (err) {
      return next(err);
    }
    res.send(image);
  }

  // get all category image
  async getCategoriesImage(req, res, next) {
    const { categoryId } = req.params;
    let images;
    try {
      images = await imageFacade.findAll({ where: { categoryId } });
    } catch (err) {
      return next(err);
    }
    res.send(images);
  }

  // delete image
  async deleteCategoryImage(req, res, next) {
    const { id } = req.params;
    let image;
    try {
      image = await imageFacade.findOne({ where: { id } });
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

  // get featured category with image
  async getFeaturedCategory(req, res, next) {
    let products;
    let categories;
    try {
      products = await productFacade.findAll({
        attributes: [sequelize.fn('DISTINCT', sequelize.col('categoryId')), 'categoryId', 'id', 'totalLike'],
        order: [['totalLike', 'DESC']]
      });
    } catch (err) {
      return next(err);
    }
    const categoryIds = _.map(products, 'categoryId');
    try {
      categories = await categoryFacade.findAll({
        where: { id: { [Op.in]: categoryIds } },
        limit: 4,
        include: ['images']
      });
    } catch (err) {
      return next(err);
    }
    res.send(categories);
  }
}

module.exports = new MemberController(categoryFacade);

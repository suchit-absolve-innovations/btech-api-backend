/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const asyncModule = require('async');
const config = require('config');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const fs = Promise.promisifyAll(require('fs'));
const uid = require('uid2');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const otpLength = 10;

module.exports = {
  runPolicies(req, res, next) {
    const list = this;
    asyncModule.eachSeries(
      list,
      (policy, cb) => {
        require(`../policies/${policy}`)(req, res, next, cb);
      },
      (err, result) => {
        if (err) return next(err);
        const error = new Error('Unauthenticated');
        error.statusCode = 401;
        return next(error);
      }
    );
  },
  hashPassword: password =>
    new Promise(async (resolve, reject) => {
      try {
        await bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      } catch (e) {
        reject(e);
      }
    }),
  matchPassword: (plain, password) =>
    new Promise(async (resolve, reject) => {
      if (password && plain) {
        const isMatch = bcrypt.compareAsync(plain, password);
        resolve(isMatch);
      } else {
        resolve(false);
      }
    }),
  generateOtp: async () => uid(otpLength),
  getCompleteUrl: path => {
    const p = `${config.get('swaggerHost')}/${path}`;
    return p;
  },
  deleteImage: async id => {
    const path = id.split('static').pop();
    try {
      await fs.unlinkAsync(`./static/${path}`);
    } catch (err) {
      return err;
    }
  },
  imageCompress: async (destination, key) => {
    try {
      await imagemin([key], {
        destination,
        plugins: [
          mozjpeg({ quality: 80 }),
          imageminPngquant({
            quality: [1, 1]
          })
        ]
      });
    } catch (err) {
      return err;
    }
  }
};

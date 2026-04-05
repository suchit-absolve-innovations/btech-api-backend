const Promise = require('bluebird');
const _ = require('lodash');
const Sequelize = require('sequelize');

class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  // create
  create(body, options) {
    return new Promise((resolve, reject) => {
      this.Schema.create(body, options)
        .then(result => resolve(result))
        .catch(Sequelize.ValidationError, err => {
          const { message } = err.errors[0];
          const error = new Error(message);
          error.statusCode = 400;
          return reject(error);
        })
        .catch(Sequelize.DatabaseError, err => {
          err.statusCode = 422;
          return reject(err);
        })
        .catch(e => reject(e));
    });
  }

  // update
  update(body, where) {
    return new Promise((resolve, reject) => {
      this.Schema.update(body, where)
        .then(result => resolve(result))
        .catch(Sequelize.ValidationError, err => {
          const { message } = err.errors[0];
          const error = new Error(message);
          error.statusCode = 400;
          return reject(error);
        })
        .catch(Sequelize.DatabaseError, err => {
          err.statusCode = 422;
          return reject(err);
        })
        .catch(e => reject(e));
    });
  }

  // findAll
  findAll(where) {
    return new Promise((resolve, reject) => {
      this.Schema.findAll(where)
        .then(result => resolve(result))
        .catch(e => reject(e));
    });
  }

  // delete by id
  destroy(where) {
    return new Promise((resolve, reject) => {
      this.Schema.destroy(where)
        .then(result => resolve(result))
        .catch(e => reject(e));
    });
  }

  // find One
  findOne(where) {
    return new Promise((resolve, reject) => {
      this.Schema.findOne(where)
        .then(result => resolve(result))
        .catch(e => reject(e));
    });
  }

  count(body) {
    return new Promise(async (resolve, reject) => {
      const result = { count: 0 };
      try {
        const count = await this.Schema.count(body);
        result.count += _.toInteger(count);
      } catch (e) {
        return reject(e);
      }
      resolve(result);
    });
  }

  queryWithShard(query, isRead) {
    return new Promise((resolve, reject) => {
      const options = {};
      if (isRead) options.type = Sequelize.QueryTypes.SELECT;
      this.Schema.query(query, options).then(
        result => {
          resolve(result);
        },
        err => {
          reject(err);
        }
      );
    });
  }
}

module.exports = Facade;

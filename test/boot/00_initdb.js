const Promise = require('bluebird');
const config = require('config');
const dbConfig = config.get('db');

module.exports = app =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise(async (resolve, reject) => {
    console.log('Testing Boot script - Starting initdb');
    // const dropQuery = 'DROP TABLE IF EXISTS "SequelizeMeta"';
    const dropQuery = `DROP DATABASE  \`${dbConfig.database}\``;
    const createQuery = `CREATE DATABASE \`${dbConfig.database}\``;
    const selectQuery = `USE  \`${dbConfig.database}\``;

    try {
      await sequelize.query(dropQuery);
      await sequelize.query(createQuery);
      await sequelize.query(selectQuery);
      await sequelize.sync();
    } catch (e) {
      reject(e);
    }
    console.log('Testing Boot script - Resolving initdb No Need To Run Migrations');
    resolve();
  });

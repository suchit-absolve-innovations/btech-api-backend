const Umzug = require('umzug');
const cluster = require('cluster');
const Sequelize = require('sequelize');
const _ = require('lodash');
const Promise = require('bluebird');

const options = {};
if (process.env.NODE_ENV === 'testing') options.force = true;

module.exports = app =>
  new Promise(async (resolve, reject) => {
    if (!cluster.isMaster) return resolve();
    console.log('Boot script - Starting initdb');
    try {
      await sequelize.sync();
    } catch (e) {
      return reject(e);
    }
    console.log('Boot script - initialising umzug');
    const umzug = new Umzug({
      migrations: {
        params: [sequelize.getQueryInterface(), Sequelize],
        path: `${process.cwd()}/migrations`,
        pattern: /^\d+[\w-]+\.js$/
      },
      storage: 'sequelize',
      storageOptions: { sequelize }
    });
    console.log('Boot script - Running migrations');
    let migrations = await umzug.pending();
    migrations = _.map(migrations, 'file');
    console.log(`Boot script - migrations ${migrations}`);
    try {
      console.log('Boot script - Running umzug migrations');
      await umzug.execute({
        migrations,
        method: 'up'
      });
    } catch (e) {
      return reject(e);
    }
    console.log('Boot script - resolving init db');
    return resolve();
  });

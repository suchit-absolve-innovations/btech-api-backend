const Umzug = require('umzug');
const cluster = require('cluster');
const Sequelize = require('sequelize');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = app =>
  new Promise(async (resolve, reject) => {
    if (!cluster.isMaster) return resolve();
    console.log('Boot script - Starting Seed DB');

    const umzug = new Umzug({
      migrations: {
        params: [sequelize.getQueryInterface(), Sequelize],
        path: `${process.cwd()}/seeds`,
        pattern: /\.js$/
      },
      storage: 'sequelize',
      storageOptions: { sequelize }
    });
    console.log('Boot script - Running Seeding');
    let migrations = await umzug.pending();
    migrations = _.map(migrations, 'file');
    console.log(`Boot script - migrations ${migrations}`);
    try {
      await umzug.execute({
        migrations,
        method: 'up'
      });
    } catch (e) {
      return reject(e);
    }
    console.log('Boot script - resolving SeedDb');
    return resolve();
  });

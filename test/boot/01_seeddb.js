const Umzug = require('umzug');
const Sequelize = require('sequelize');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = app =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise(async (resolve, reject) => {
    console.log('Boot script - Starting Seed DB');
    console.log('Boot script - initialising umzug');
    const umzug = new Umzug({
      migrations: {
        params: [sequelize.getQueryInterface(), Sequelize],
        path: `${process.cwd()}/seeds`,
        pattern: /\.js$/
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize
      }
    });
    console.log('Boot script - Running Seeding');
    let migrations = await umzug.pending();
    migrations = _.map(migrations, 'file');
    console.log(`Boot script - migrations ${migrations}`);
    try {
      console.log('Boot script - Running umzug Seeding');
      await umzug.execute({
        migrations,
        method: 'up'
      });
    } catch (e) {
      console.log(`Boot script - rejectect db config ${e}`);
      return reject(e);
    }
    console.log('Boot script - resolveolving SeedDb');
    return resolve();
  });

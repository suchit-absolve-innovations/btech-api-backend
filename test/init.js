/* eslint-disable global-require */
const Sequelize = require('sequelize');
const config = require('config');
const supertest = require('supertest');
const serverUtils = require('../utils/serverUtils');

before(async () => {
  global.request = require('supertest');
  global.expect = require('chai').expect;
  global.assert = require('chai').assert;
  const dbConfig = config.get('db');
  global.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.setting);

  require('../index.js');
  await serverUtils.boot(app);
  global.request = supertest(app);

  const memberFacade = require('../models/member/facade');
  const deviceType = 'android';

  global.pMember = await memberFacade.findOne({
    where: { email: 'nikhilmisra63@gmail.com' }
  });

  try {
    await pMember.createAccessToken(deviceType);
  } catch (e) {
    console.log(e);
  }
});

after(async () => {
  console.log('finish');
  // timeout for istanbul & nyc
  setTimeout(() => {
    process.exit(0);
  }, 3000);
});

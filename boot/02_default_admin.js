const cluster = require('cluster');
const authUtils = require('../utils/auth');
const defaultAdmins = [
  {
    username: 'nikhil',
    firstName: 'Nikhil',
    lastName: 'Mishra',
    email: 'nikhilmisra63@gmail.com',
    emailStatus: 'verified',
    contactNumber: '+918931097382',
    password: 'qwertyuiop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'rajat',
    firstName: 'Rajat',
    lastName: 'Sehgal',
    email: 'rajatsehgal8@gmail.com',
    emailStatus: 'verified',
    contactNumber: '+918103695448',
    password: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/* eslint global-require: 0 */
module.exports = app =>
  new Promise(async (resolve, reject) => {
    if (!cluster.isMaster) return resolve();
    console.log('Boot script - initialising default_admin');
    const userFacade = require('../models/member/facade');

    for (const defaultAdmin of defaultAdmins) {
      defaultAdmin.password = await authUtils.hashPassword(defaultAdmin.password);
      try {
        const alreadyExistEngineer = await userFacade.findOne({
          where: { email: defaultAdmin.email }
        });
        if (alreadyExistEngineer) continue;
      } catch (e) {
        return reject(e);
      }
      try {
        const admin = await userFacade.create(defaultAdmin);
        await admin.addRole('admin');
        if (defaultAdmin.email === 'nikhilmisra63@gmail.com') {
          await admin.addRole('seller');
          await admin.addRole('buyer');
        }
      } catch (e) {
        return reject(e);
      }
    }
    resolve();
  });

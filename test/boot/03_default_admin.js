/* eslint-disable no-await-in-loop */
const Promise = require('bluebird');
const authUtils = require('../../utils/auth');

const defaultAdmins = [
  {
    username: 'nik636',
    firstName: 'Nikhil',
    lastName: 'Mishra',
    password: 'zxcvbnm',
    email: 'nikhilmisra63@gmail.com',
    contactNumber: '+918931097382',
    age: 24,
    emailStatus: true
  }
];
let password;
module.exports = app =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise(async (resolve, reject) => {
    console.log('Boot script - initializing default_admin');

    const employeeFacade = require('../../models/member/facade');
    for (const defaultAdmin of defaultAdmins) {
      password = await authUtils.hashPassword(defaultAdmin.password);
      defaultAdmin.password = password;
      try {
        const alreadyExistAdmin = await employeeFacade.findOne({
          where: { email: defaultAdmin.email }
        });
        if (alreadyExistAdmin) {
          return resolve();
        }
        const admin = await employeeFacade.create(defaultAdmin);
        await admin.addRole('admin');
      } catch (e) {
        return reject(e);
      }
    }
    resolve();
  });

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const am = require('async');
module.exports = {
  isValidNumber: contactNumber => {
    const number = phoneUtil.parseAndKeepRawInput(contactNumber, null);
    const validNumber = phoneUtil.isValidNumber(number);
    if (!validNumber) return false;
    return true;
  },
  // isValidName: (name) => {
  //   // eslint-disable-next-line no-useless-escape
  //   const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  //   if (format.test(name)) {
  //     return false;
  //   }
  //   return true;
  // }
  checkValidators: (validators, req, res) =>
    new Promise((resolve, reject) => {
      am.eachSeries(
        validators,
        (validator, done) => {
          validator(req, res, done);
        },
        err => {
          if (err) return reject(err);
          return resolve();
        }
      );
    })
};

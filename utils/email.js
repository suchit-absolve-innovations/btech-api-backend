/* eslint-disable global-require */
const nodemailer = require('nodemailer');
const path = require('path');
const config = require('config');
const uid = require('uid2');
const { EmailTemplate } = require('email-templates');

const transporter = nodemailer.createTransport({
  host: config.get('emailConfig').host,
  port: config.get('emailConfig').port,
  auth: {
    user: config.get('emailConfig').user,
    pass: config.get('emailConfig').pass
  },
  tls: { rejectUnauthorized: false }
});
let memberFacade;
let addressFacade;

module.exports = {
  sendForgotPasswordMail: async member => {
    const templateDir = path.join(__dirname, '../', 'templates', 'forgotPassword');
    try {
      member.otp = await uid(config.get('otpLength'));
      await member.save();
    } catch (error) {
      return console(error);
    }
    const forgotPassword = new EmailTemplate(templateDir);
    const link = `${config.get('webLink')}/Set-Password/${member.otp}/${member.id}`;
    const data = {
      name: `${member.firstName} ${member.lastName}`,
      link
    };
    if (config.get('isTesting')) return;
    forgotPassword.render(data, 'en', (error, result) => {
      if (error) return console.log(error);
      const mailOptions = {
        from: config.get('emailConfig').sender,
        to: member.email,
        subject: 'Forgot Password',
        html: result.html
      };
      transporter.sendMail(mailOptions, (error, res) => {
        if (error) {
          return log.error(error);
        }
        return log.info(res);
      });
    });
  },
  changePasswordEmail: async member => {
    // if (config.get('isTesting')) return;
    const templateDir = path.join(__dirname, '../', 'templates', 'passwordChange');
    const changePassword = new EmailTemplate(templateDir);
    const data = { firstName: member.firstName, lastName: member.lastName };
    if (config.get('isTesting')) return;
    changePassword.render(data, 'en', (error, result) => {
      if (error) return console.log(error);
      const mailOptions = {
        from: config.get('emailConfig').sender,
        to: member.email,
        subject: 'Change Password',
        html: result.html
      };
      transporter.sendMail(mailOptions, (error, res) => {
        if (error) {
          return log.error(error);
        }
        return log.info(res);
      });
    });
  },
  sendVerifyMail: member =>
    new Promise(async (resolve, reject) => {
      console.log(`sending verify mail to ${member.email}`);
      try {
        member.otp = await uid(config.get('otpLength'));
        await member.save();
      } catch (error) {
        return reject(error);
      }
      let name;
      if (member.lastName) {
        name = `${member.firstName} ${member.lastName}`;
      } else {
        name = member.firstName;
      }
      const templateDir = path.join(__dirname, '../', 'templates', 'verifyEmail');
      const verifyEmailTemplate = new EmailTemplate(templateDir);
      const link = `${config.get('webLink')}/Verify-Email/${member.otp}/${member.id}`;
      if (config.get('isTesting')) return resolve();
      verifyEmailTemplate.render(
        {
          name,
          link
        },
        'en',
        (error, result) => {
          if (error) return log.error(error);
          const options = {
            to: member.email,
            from: config.get('emailConfig').sender,
            subject: 'Email Verification',
            html: result.html
          };
          try {
            transporter.sendMail(options, (error, res) => {
              if (error) {
                return reject(error);
              }
              log.info(res);
              resolve();
            });
          } catch (error) {
            return reject(error);
          }
        }
      );
    }),
  orderPlaced: (order, member, type) =>
    new Promise(async (resolve, reject) => {
      if (!memberFacade) memberFacade = require('../models/member/facade');
      if (!addressFacade) addressFacade = require('../models/address/facade');
      if (!member) {
        try {
          member = await memberFacade.findOne({ where: { id: order.memberId } });
        } catch (error) {
          if (error) {
            log.error(error);
            return resolve();
          }
        }
      }
      log.info(`sending order placed email to ${member.email}`);
      const templateDir = path.join(__dirname, '../', 'templates', 'orderPlaced');
      const verifyEmailTemplate = new EmailTemplate(templateDir);
      if (!order.dataValues.address) {
        let address;
        try {
          address = await addressFacade.findOne({
            where: { id: order.addressId },
            include: ['states', 'country']
          });
        } catch (error) {
          if (error) {
            log.error(error);
            return resolve();
          }
        }
        address.dataValues.stateName = address.states ? address.states.name : null;
        address.dataValues.countryName = address.country ? address.country.country : null;
        order.dataValues.address = address;
      }
      if (!order.dataValues.products) order.dataValues.products = order.dataValues.info;
      verifyEmailTemplate.render(
        {
          orderId: order.id,
          totalAmount: order.amount,
          products: order.dataValues.products,
          address: order.dataValues.address.address,
          city: order.dataValues.address.dataValues.stateName,
          country: order.dataValues.address.dataValues.countryName,
          pinCode: order.dataValues.address.dataValues.pinCode
        },
        'en',
        (error, result) => {
          if (error) {
            log.error(error);
            return resolve();
          }
          const options = {
            to: member.email,
            from: config.get('emailConfig').sender,
            subject: 'Order Placed',
            html: result.html
          };
          if (config.get('isTesting')) return resolve();
          try {
            transporter.sendMail(options, (error, res) => {
              if (error) {
                log.error(error);
                return resolve();
              }
              log.info(res);
              return resolve();
            });
          } catch (error) {
            if (error) {
              log.error(error);
              return resolve();
            }
          }
        }
      );
    }),
  sendSellerInfo: async member => {
    if (config.get('isTesting')) return;
    const mailOptions = {
      from: config.get('emailConfig').sender,
      to: 'info@mrbandweb.com',
      subject: 'New Seller',
      html: '<b>you have a new seller account that needs verification</b>'
    };
    transporter.sendMail(mailOptions, (error, res) => {
      if (error) {
        return log.error(error);
      }
      return log.info(res);
    });
  }
};

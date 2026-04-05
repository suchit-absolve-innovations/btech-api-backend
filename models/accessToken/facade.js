/* eslint-disable camelcase */
/* eslint-disable global-require */
const Promise = require('bluebird');
const graph = Promise.promisifyAll(require('fbgraph'));
const config = require('config');
const { OAuth2Client } = require('google-auth-library');
const Facade = require('../../lib/facade');
const schema = require('./schema');
const authUtils = require('../../utils/auth');
const gClient = new OAuth2Client(config.get('googleClientId'));
const verifyGoogleLogin = async token => {
  const ticket = await gClient.verifyIdToken({
    idToken: token
  });
  const payload = ticket.getPayload();
  return payload;
};

let memberFacade;
const client = {
  /* Needed by refresh_token grant, because there is a bug at line 103 in 
  https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js 
  (used client.id instead of client.clientId) */
  id: 'application',
  clientId: 'application',
  grants: ['refresh_token', 'fb_auth', 'google_auth', 'password'],
  redirectUris: []
};

class AccessTokenFacade extends Facade {
  async getClient() {
    return client;
  }

  saveToken(token, client, member, deviceType, deviceToken) {
    const that = this;
    return new Promise(async (resolve, reject) => {
      if (!member.sequelize) return resolve(token);
      token.user = member;
      token.client = {
        id: client.clientId
      };
      const memberId = member.id;
      const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt } = token;
      try {
        await that.create({
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
          memberId,
          deviceType,
          deviceToken
        });
      } catch (err) {
        const error = new Error(err.message);
        error.statusCode = error.code;
        return reject(err);
      }
      return resolve(token);
    });
  }

  async getUser(token, grantType, password) {
    memberFacade = require('../member/facade');
    return new Promise(async (resolve, reject) => {
      graph.setAccessToken(token);
      let fbRes;
      let googleRes;
      let member;
      switch (grantType) {
        case 'fb_auth':
          try {
            fbRes = await graph.getAsync('/me?fields=name,email,id,gender');
          } catch (e) {
            const error = new Error(e.message);
            error.statusCode = error.code;
            return reject(error);
          }
          try {
            member = await memberFacade.findOne({ where: { fbId: fbRes.id } });
          } catch (e) {
            return reject(e);
          }
          if (member) {
            if (member.status === false) {
              const error = new Error('you account is temporary disabled by the admin please contact');
              error.statusCode = 403;
              return reject(error);
            }
            break;
          } else {
            try {
              const { name, email, gender } = fbRes;
              const fbId = fbRes.id;
              member = await memberFacade.create({
                firstName: name,
                email,
                fbId,
                gender,
                emailStatus: 'verified'
              });
              await member.addRole('buyer');
            } catch (e) {
              const error = new Error(e.message);
              error.statusCode = error.code;
              return reject(e);
            }
          }
          break;

        case 'google_auth':
          try {
            googleRes = await verifyGoogleLogin(token);
          } catch (error) {
            return reject(error);
          }

          // try {
          //   googleRes = await axios.get(
          //     `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
          //   );
          // } catch (err) {
          //   const error = new Error(err.message);
          //   error.statusCode = error.code;
          //   return reject(err);
          // }
          try {
            member = await memberFacade.findOne({
              where: { googleId: googleRes.sub }
            });
          } catch (err) {
            return reject(err);
          }
          if (member) {
            if (member.status === false) {
              const error = new Error('you account is temporary disabled by the admin please contact');
              error.statusCode = 403;
              return reject(error);
            }
            break;
          } else {
            try {
              let firstName = null;
              let lastName = null;
              const { name, given_name, family_name, email, gender } = googleRes;
              const googleId = googleRes.sub;
              firstName = given_name === null ? name : given_name;
              lastName = family_name;
              member = await memberFacade.create({
                firstName,
                lastName,
                email,
                googleId,
                gender,
                emailStatus: 'verified'
              });
              await member.addRole('buyer');
            } catch (e) {
              const error = new Error(e.message);
              error.statusCode = error.code;
              return reject(e);
            }
          }
          break;
        case 'password':
          try {
            member = await memberFacade.findOne({
              where: { email: token }
            });
          } catch (err) {
            const error = new Error(err.message);
            error.statusCode = error.code;
            return reject(err);
          }
          if (!member) {
            const error = new Error('Member not found');
            error.statusCode = 204;
            return reject(error);
          }

          if (member.emailStatus === 'pending') {
            const error = new Error('Your email is not verified please verify your email');
            error.statusCode = 403;
            return reject(error);
          }
          if (member.status === false) {
            const error = new Error('you account is temporary disabled by the admin please contact');
            error.statusCode = 403;
            return reject(error);
          }
          try {
            const isMatch = await authUtils.matchPassword(password, member.password);
            if (!isMatch) {
              const error = new Error('Email or Password is incorrect');
              error.statusCode = 401;
              return reject(error);
            }
          } catch (e) {
            return reject(e);
          }
          break;

        default:
          break;
      }
      if (member.stats === false) {
        const error = new Error('This account is current disabled please contact to admin');
        error.statusCode = 403;
        return reject(error);
      }
      resolve(member);
    });
  }

  getRefreshToken(refreshToken) {
    const that = this;
    let token;
    return new Promise(async (resolve, reject) => {
      try {
        token = await that.findOne({ where: { refreshToken }, include: ['member'] });
      } catch (err) {
        const error = new Error(err.message);
        error.statusCode = error.code;
        return reject(err);
      }
      if (!token) return resolve(token);
      token.user = token.member;
      token.client = { id: client.clientId };
      return resolve(token);
    });
  }

  revokeToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        await token.destroy();
      } catch (e) {
        console.log(e);
        return false;
      }
      return resolve(true);
    });
  }
}

module.exports = new AccessTokenFacade(schema);

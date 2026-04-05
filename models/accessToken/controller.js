const OAuth2Server = require('oauth2-server');
const { validationResult, body } = require('express-validator/check');

const validator = require('../../utils/validator');
const validation = require('../../utils/validation');
const accessTokenFacade = require('./facade');
const { Request } = OAuth2Server;
const { Response } = OAuth2Server;

class AccessTokenController {
  async obtainToken(req, res, next) {
    // validation
    const grantType = req.body.grant_type;
    let error;
    const validatorMiddlewares = [];
    switch (grantType) {
      case 'password':
        validatorMiddlewares.push(
          body('token')
            .exists()
            .isEmail()
            .withMessage('email is required')
        );
        validatorMiddlewares.push(
          body('deviceType')
            .exists()
            .withMessage('deviceType required')
            .isIn(['android', 'ios', 'web'])
            .withMessage('Invalid deviceType')
        );
        validatorMiddlewares.push(
          body('password')
            .exists()
            .withMessage('password is required')
        );
        break;

      case 'refresh_token':
        validatorMiddlewares.push(
          body('refresh_token')
            .exists()
            .withMessage('refresh_token is required')
        );
        break;
      case 'fb_auth':
        validatorMiddlewares.push(
          body('token')
            .exists()
            .withMessage('facebook token is required')
        );
        break;
      case 'google_auth':
        validatorMiddlewares.push(
          body('token')
            .exists()
            .withMessage('google token is required')
        );
        break;

      default:
        break;
    }
    if (validatorMiddlewares.length === 0) {
      error = new Error('Invalid grant type');
      error.statusCode = 422;
      return next(error);
    }

    try {
      await validation.checkValidators(validatorMiddlewares, req, res);
    } catch (e) {
      return next(e);
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return validator(req, res, next);
    }

    // https://github.com/oauthjs/node-oauth2-server/issues/428
    req.body.client_id = 'application';
    const request = new Request(req);
    const response = new Response(res);
    return app.oauth
      .token(request, response)
      .then(async token => {
        token.memberId = token.user.id;
        token.firstName = token.user.firstName;
        token.lastName = token.user.lastName;
        token.roles = await token.user.getRoles();
        delete token.client;
        delete token.user;
        res.json(token);
      })
      .catch(err => {
        const error = new Error(err.message);
        if (err.message === 'Member not found') {
          err.code = 204;
        }
        if (err.inner) {
          error.message = err.inner.message;
          error.statusCode = err.inner.statusCode;
        }
        if (!error.statusCode) error.statusCode = 403;
        return next(error);
      });
  }
}

module.exports = new AccessTokenController(accessTokenFacade);

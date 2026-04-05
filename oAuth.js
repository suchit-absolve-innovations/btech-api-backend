const InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error');
const AbstractGrantType = require('oauth2-server/lib/grant-types/abstract-grant-type');
const OAuth2Server = require('oauth2-server');
const InvalidGrantError = require('oauth2-server/lib/errors/invalid-grant-error');
const InvalidRequestError = require('oauth2-server/lib/errors/invalid-request-error');
const ServerError = require('oauth2-server/lib/errors/server-error');
const Promise = require('bluebird');
const promisify = require('promisify-any').use(Promise);
const util = require('util');
const config = require('config');

/**
 * Constructor.
 */

function SocialAuthGrantType(options) {
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getUser) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
  }

  AbstractGrantType.call(this, options);
}

function LocalAuthGrantType(options) {
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getUser) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
  }

  AbstractGrantType.call(this, options);
}

function RefreshGrantType(options) {
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getUser) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
  }

  AbstractGrantType.call(this, options);
}

/**
 * Inherit prototype.
 */
util.inherits(LocalAuthGrantType, AbstractGrantType);
util.inherits(RefreshGrantType, AbstractGrantType);
util.inherits(SocialAuthGrantType, AbstractGrantType);

/**
 * Retrieve the user from the model using a username/password combination.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
 */

SocialAuthGrantType.prototype.handle = function(request, client) {
  const { deviceType, deviceToken } = request.body;
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`');
  }
  if (!deviceType) {
    throw new InvalidArgumentError('Missing parameter: `Device Type`');
  }

  const scope = this.getScope(request);

  return Promise.bind(this)
    .then(function() {
      return this.getUser(request);
    })
    .then(function(user) {
      return this.saveToken(user, client, scope, deviceType, deviceToken);
    });
};

LocalAuthGrantType.prototype.handle = function(request, client) {
  const { deviceType, deviceToken } = request.body;

  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }

  // if (!client) {
  //   throw new InvalidArgumentError('Missing parameter: `client`');
  // }

  if (!deviceType) {
    throw new InvalidArgumentError('Missing parameter: `Device Type`');
  }

  const scope = this.getScope(request);

  return Promise.bind(this)
    .then(function() {
      return this.getUser(request);
    })
    .then(function(user) {
      return this.saveToken(user, client, scope, deviceType, deviceToken);
    });
};

RefreshGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`');
  }

  return Promise.bind(this)
    .then(function() {
      return this.getRefreshToken(request, client);
    })
    .tap(function(token) {
      return this.revokeToken(token, token.deviceType, token.deviceToken);
    })
    .then(function(token) {
      return this.saveToken(token.user, client, token.scope, token.deviceType, token.deviceToken);
    });
};
/**
 * Get user using a username/password combination.
 */

SocialAuthGrantType.prototype.getUser = function(request) {
  if (!request.body.token) {
    throw new InvalidRequestError('Missing parameter: `token`');
  }

  // find and then create

  return promisify(this.model.getUser, 3)
    .call(
      this.model,
      request.body.token,
      request.body.grant_type,
      request.body.password,
      request.body.deviceType,
      request.body.deviceToken
    )
    .then(user => {
      if (!user) {
        throw new InvalidGrantError('Invalid grant: user token is invalid');
      }
      return user;
    });
};

LocalAuthGrantType.prototype.getUser = function(request) {
  request.body.email = request.body.token; // because of socialGrantType we need token
  if (!request.body.email) {
    throw new InvalidRequestError('Missing parameter: `email`');
  }

  if (!request.body.password) {
    throw new InvalidRequestError('Missing parameter: `password`');
  }

  // find and then create

  return promisify(this.model.getUser, 3)
    .call(
      this.model,
      request.body.email,
      request.body.grant_type,
      request.body.password,
      request.body.deviceType,
      request.body.deviceToken
    )
    .then(user => {
      if (!user) {
        throw new InvalidGrantError('Invalid grant: user token is invalid');
      }
      return user;
    });
};

RefreshGrantType.prototype.getRefreshToken = function(request, client) {
  if (!request.body.refresh_token) {
    throw new InvalidRequestError('Missing parameter: `refresh_token`');
  }

  return promisify(this.model.getRefreshToken, 3)
    .call(this.model, request.body.refresh_token)
    .then(token => {
      if (!token) {
        throw new InvalidGrantError('Invalid grant: refresh token is invalid');
      }

      if (!token.client) {
        throw new ServerError('Server error: `getRefreshToken()` did not return a `client` object');
      }

      if (!token.user) {
        throw new ServerError('Server error: `getRefreshToken()` did not return a `user` object');
      }

      if (token.client.id !== client.id) {
        throw new InvalidGrantError('Invalid grant: refresh token is invalid');
      }

      if (token.refreshTokenExpiresAt && !(token.refreshTokenExpiresAt instanceof Date)) {
        throw new ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
      }

      if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date()) {
        throw new InvalidGrantError('Invalid grant: refresh token has expired');
      }

      request.body.deviceType = token.deviceType;
      request.body.deviceToken = token.deviceToken;
      return token;
    });
};

/**
 * Save token.
 */

SocialAuthGrantType.prototype.saveToken = function(user, client, scope, deviceType, deviceToken) {
  const fns = [
    this.validateScope(user, client, scope),
    this.generateAccessToken(client, user, scope),
    this.generateRefreshToken(client, user, scope),
    this.getAccessTokenExpiresAt(),
    this.getRefreshTokenExpiresAt()
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(scope, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
      const token = {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        scope
      };

      return promisify(this.model.saveToken, 5).call(this.model, token, client, user, deviceType, deviceToken);
    });
};

LocalAuthGrantType.prototype.saveToken = function(user, client, scope, deviceType, deviceToken) {
  const fns = [
    this.validateScope(user, client, scope),
    this.generateAccessToken(client, user, scope),
    this.generateRefreshToken(client, user, scope),
    this.getAccessTokenExpiresAt(),
    this.getRefreshTokenExpiresAt()
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(scope, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
      const token = {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
        scope
      };

      return promisify(this.model.saveToken, 5).call(this.model, token, client, user, deviceType, deviceToken);
    });
};

/**
 * Revoke the refresh token.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-6
 */

RefreshGrantType.prototype.revokeToken = function(token) {
  if (this.alwaysIssueNewRefreshToken === false) {
    return Promise.resolve(token);
  }

  return promisify(this.model.revokeToken, 1)
    .call(this.model, token)
    .then(status => {
      if (!status) {
        throw new InvalidGrantError('Invalid grant: refresh token is invalid');
      }

      return token;
    });
};

/**
 * Save token.
 */

RefreshGrantType.prototype.saveToken = function(user, client, scope, deviceType, deviceToken) {
  const fns = [
    this.generateAccessToken(client, user, scope),
    this.generateRefreshToken(client, user, scope),
    this.getAccessTokenExpiresAt(),
    this.getRefreshTokenExpiresAt()
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt) {
      const token = {
        accessToken,
        accessTokenExpiresAt,
        scope
      };

      if (this.alwaysIssueNewRefreshToken !== false) {
        token.refreshToken = refreshToken;
        token.refreshTokenExpiresAt = refreshTokenExpiresAt;
      }

      return token;
    })
    .then(function(token) {
      return promisify(this.model.saveToken, 5)
        .call(this.model, token, client, user, deviceType, deviceToken)
        .then(savedToken => savedToken);
    });
};

app.oauth = new OAuth2Server({
  // eslint-disable-next-line global-require
  model: require('./models/accessToken/facade'),
  accessTokenLifetime: config.get('accessTokenLifetime'),
  refreshTokenLifetime: config.get('refreshTokenLifetime'),
  allowBearerTokensInQueryString: true,
  requireClientAuthentication: {
    password: false,
    fb_auth: false,
    google_auth: false,
    refresh_token: false
  },
  extendedGrantTypes: {
    fb_auth: SocialAuthGrantType,
    google_auth: SocialAuthGrantType,
    refresh_token: RefreshGrantType,
    password: LocalAuthGrantType
  }
});

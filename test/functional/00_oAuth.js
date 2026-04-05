/* eslint-disable global-require */
const config = require('config');
const version = config.get('version');
describe('LOGIN', async () => {
  it.skip('should be able to get access token from facebook', async () => {
    await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token:
          process.env.FACEBOOK_TEST_TOKEN ||
        grant_type: 'fb_auth',
        deviceType: 'android',
        deviceToken: 'qwertyu12345'
      })
      .expect(200);
  });

  it.skip('should be able to get access token from google', async () => {
    await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token:
          process.env.GOOGLE_TEST_TOKEN ||
        grant_type: 'google_auth',
        deviceType: 'android',
        deviceToken: 'qwertyu12345'
      })
      .expect(200);
  });
  it.skip('Should be able to refresh token', async () => {
    const accessTokenFacade = require('../../models/accessToken/facade');
    const accessToken = await accessTokenFacade.findAll({
      include: ['member']
    });
    const { refreshToken } = accessToken[0].dataValues;
    await request
      .post(`/${version}/oAuth/RefreshToken`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        deviceType: 'android',
        deviceToken: 'qwertyu12345'
      })
      .expect(200);
  });
});

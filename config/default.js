const createDbSettings = require('./dbSettings');

module.exports = {
  db: {
    username: 'root',
    database: process.env.DB_NAME,
    setting: createDbSettings()
  },
  port: 3300,
  isTesting: false,
  swaggerHost: process.env.API_URL,
  emailConfig: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    sender: process.env.SMTP_SENDER_EMAIL
  },
  webLink: 'http://testspace.tech/btech',
  otpLength: 40,
  version: 'v1',
  allowedImagesTypes: ['image/jpg', 'image/jpeg', 'image/png'],
  allowedFileTypes: ['application/pdf'],
  maxPictureSize: 10000000, // 10 MB
  maxFileSize: 10000000, // 10 MB
  accessTokenLifetime: 604800, // 1 week
  refreshTokenLifetime: 1209600, // 2 month
  accessTokenLength: 64,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '618677427780-4qucca2ncos31mkbdpl5k9et5ofjdp90.apps.googleusercontent.com',
  striptSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  enableLog: false
};

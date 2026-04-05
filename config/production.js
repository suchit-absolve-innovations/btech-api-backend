const createDbSettings = require('./dbSettings');

module.exports = {
  db: {
    database: process.env.DB_NAME,
    setting: createDbSettings()
  },
  port: 7700,
  isTesting: false,
  isProduction: true,
  webLink: 'https://mobile.mrbandweb.com',
  swaggerHost: 'mobile.mrbandweb.com/btech',
  emailConfig: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    sender: process.env.SMTP_SENDER_EMAIL
  },
  striptSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_live_placeholder',
  enableLog: true
};

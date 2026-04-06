const createDbSettings = require('./dbSettings');

module.exports = {
  db: {
    database: process.env.DB_NAME,
    setting: createDbSettings()
  },
  port: 6600,
  isTesting: false,
  isProduction: false,
  webLink: process.env.WEB_LINK || 'http://localhost:4200',
  swaggerHost: process.env.API_URL,
  emailConfig: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    sender: process.env.SMTP_SENDER_EMAIL
  },
  striptSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  enableLog: true
};

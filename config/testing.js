module.exports = {
  db: {
    username: 'root',
    database: 'btech-testing',
    setting: {
      host: 'localhost',
      port: '3306',
      dialect: 'mysql',
      pool: {
        max: 1000,
        min: 0,
        idle: 10000,
        acquire: 10000
      },
      dialectOptions: {
        decimalNumbers: true,
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      replication: {
        read: [{ host: 'localhost', username: 'root', password: process.env.DB_PASSWORD || 'pendrive' }],
        write: { host: 'localhost', username: 'root', password: process.env.DB_PASSWORD || 'pendrive' }
      },
      logging: false
    }
  },
  port: 5500,
  isTesting: true,
  swaggerHost: 'localhost:3300',
  striptSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  emailConfig: {
    host: 'mail.mrbandweb.com',
    port: 2525,
    user: 'btechnologies@mrbandweb.com',
    pass: process.env.SMTP_PASS || 'placeholder_password',
    sender: 'btechnologies@mrbandweb.com'
  },
  enableLog: false
};
